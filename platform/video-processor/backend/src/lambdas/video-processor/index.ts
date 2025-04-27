import {S3, MediaConvert} from "aws-sdk"
import { S3Event } from 'aws-lambda';
import path from "path"

const s3 = new S3();
const mediaConvert = new MediaConvert({
  endpoint: process.env.MEDIACONVERT_ENDPOINT,
});

/**
 * Video Processor
 * Listens to aws_s3_bucket_notification.input_notification
 * and creates DASH and HLS manifests as well as
 * thumbnails for mp4 input
 * Renditions: 1080 - 720 - 480
 * Segment Lenght: 6s
 * s3://<input-bucket>/<projectId>/<fileId>
 */
const handler = async (event: S3Event): Promise<void> => {
    console.log('Processing video upload event', JSON.stringify(event, null, 2));
  
    if(
        !process.env.MEDIACONVERT_ENDPOINT ||
        !process.env.MEDIACONVERT_ROLE ||
        !process.env.MEDIACONVERT_QUEUE|| 
        !process.env.OUTPUT_BUCKET
    ) {
       throw new Error("env vars missing")
    }

    try {
        for (const record of event.Records) {
            const inputBucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

            console.log(`Processing video: s3://${inputBucket}/${key}`);

            const [projectId] = key.split('/');
            const fileNameWithExt = path.basename(key);
            const fileName = path.parse(fileNameWithExt).name;

            const outputBucket = process.env.OUTPUT_BUCKET;
            const outputPrefix = `${projectId}/${fileName}`;


            // Submit job to MediaConvert
            const jobParams = createMediaConvertJob({
                role: process.env.MEDIACONVERT_ROLE,
                queue: process.env.MEDIACONVERT_QUEUE,
                fileInput: `s3://${inputBucket}/${key}`,
                output: {
                    dash: `s3://${outputBucket}/${outputPrefix}/dash/`,
                    hls: `s3://${outputBucket}/${outputPrefix}/hls/`,
                    thumbnails: `s3://${outputBucket}/${outputPrefix}/thumbnails/`,
                }
            })
            const job = await mediaConvert.createJob(jobParams).promise();
            if(!job || !job.Job) {
                return
            }

            console.log('MediaConvert job created:', job.Job.Id);

            // Store job metadata in S3
            await s3.putObject({
                Bucket: outputBucket,
                Key: `${outputPrefix}/metadata.json`,
                ContentType: 'application/json',
                Body: JSON.stringify({
                    sourceFile: `s3://${inputBucket}/${key}`,
                    jobId: job.Job.Id,
                    outputPrefix: outputPrefix,
                    dashManifest: `${outputPrefix}/dash/${fileName}.mpd`,
                    hlsManifest: `${outputPrefix}/hls/${fileName}.m3u8`,
                    thumbnails: `${outputPrefix}/thumbnails/`,
                    createdAt: new Date().toISOString(),
                }),
            }).promise();
            
            console.log('Video processing job submitted successfully');
        }
    } catch (error) {
        console.log(JSON.stringify(error, null, 2))
    }
}

export { handler }

function createMediaConvertJob({
    role,
    queue,
    fileInput,
    output
}: {
    role: string,
    queue: string,
    fileInput: string,
    output: {
        dash: string,
        hls: string,
        thumbnails: string
    }
}): MediaConvert.Types.CreateJobRequest {
  const SEGMENT_LENGTH = 6 //seconds 
  const renditions = [
    {
      nameModifier: '1080p',
      width: 1920,
      height: 1080,
      bitrate: 5000000,
      qualityLevel: 9,
      audioBitrate: 128000,
    },
    {
      nameModifier: '720p',
      width: 1280,
      height: 720,
      bitrate: 3000000,
      qualityLevel: 8,
      audioBitrate: 96000,
    },
    {
      nameModifier: '480p',
      width: 854,
      height: 480,
      bitrate: 1000000,
      qualityLevel: 7,
      audioBitrate: 64000,
    },
  ];

  const createOutput = (container: 'MPD' | 'M3U8') => {
    return renditions.map((rendition) => ({
      NameModifier: rendition.nameModifier,
      ContainerSettings: {
        Container: container,
      },
      VideoDescription: {
        Width: rendition.width,
        Height: rendition.height,
        CodecSettings: {
          Codec: 'H_264',
          H264Settings: {
            RateControlMode: 'QVBR',
            QvbrSettings: {
              QvbrQualityLevel: rendition.qualityLevel,
            },
            MaxBitrate: rendition.bitrate,
          },
        },
      },
      AudioDescriptions: [
        {
          CodecSettings: {
            Codec: 'AAC',
            AacSettings: {
              Bitrate: rendition.audioBitrate,
              CodingMode: 'CODING_MODE_2_0',
              SampleRate: 48000,
            },
          },
        },
      ],
    }));
  }

    return {
        Role: role,
        Queue: queue,
        Settings: {
          Inputs: [
            {
              FileInput: fileInput,
              AudioSelectors: {
                'Audio Selector 1': {
                  DefaultSelection: 'DEFAULT',
                },
              },
              VideoSelector: {},
              TimecodeSource: 'ZEROBASED',
            },
          ],
          OutputGroups: [
            {
              Name: 'DASH ISO',
              OutputGroupSettings: {
                Type: 'DASH_ISO_GROUP_SETTINGS',
                DashIsoGroupSettings: {
                  SegmentLength: SEGMENT_LENGTH,
                  SegmentControl: 'SEGMENTED_FILES',
                  FragmentLength: SEGMENT_LENGTH / 2,
                  Destination: output.dash,
                },
              },
              Outputs: createOutput('MPD'),
            },
            {
              Name: 'HLS',
              OutputGroupSettings: {
                Type: 'HLS_GROUP_SETTINGS',
                HlsGroupSettings: {
                  SegmentLength: SEGMENT_LENGTH,
                  Destination: output.hls,
                  MinSegmentLength: 0,
                },
              },
              Outputs: createOutput('M3U8'),
            },
            {
              // Thumbnail generation
              Name: 'Thumbnail Generator',
              OutputGroupSettings: {
                Type: 'FILE_GROUP_SETTINGS',
                FileGroupSettings: {
                  Destination: output.thumbnails,
                },
              },
              Outputs: [
                {
                  NameModifier: 'thumbnail',
                  ContainerSettings: {
                    Container: 'RAW',
                  },
                  VideoDescription: {
                    Width: 1280,
                    Height: 720,
                    CodecSettings: {
                      Codec: 'FRAME_CAPTURE',
                      FrameCaptureSettings: {
                        FramerateNumerator: 1,
                        FramerateDenominator: 30,
                        MaxCaptures: 10,
                        Quality: 80,
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      };
}

