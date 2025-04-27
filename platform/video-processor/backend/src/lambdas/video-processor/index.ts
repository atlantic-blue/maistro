import {S3, MediaConvert} from "aws-sdk"
import { S3Event } from 'aws-lambda';
import path from "path"

const s3 = new S3();
const mediaConvert = new MediaConvert({
  endpoint: process.env.MEDIACONVERT_ENDPOINT,
});

// s3://<input-bucket>/<projectId>/<fileId>
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
        thumbnails: string
    }
}): MediaConvert.Types.CreateJobRequest {
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
                  SegmentLength: 4,
                  SegmentControl: 'SEGMENTED_FILES',
                  FragmentLength: 2,
                  Destination: output.dash,
                },
              },
              Outputs: [
                {
                  // 1080p output
                  NameModifier: '1080p',
                  ContainerSettings: {
                    Container: 'MPD',
                  },
                  VideoDescription: {
                    Width: 1920,
                    Height: 1080,
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        RateControlMode: 'QVBR',
                        QvbrSettings: {
                          QvbrQualityLevel: 9,
                        },
                        MaxBitrate: 5000000,
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 128000,
                          CodingMode: 'CODING_MODE_2_0',
                          SampleRate: 48000,
                        },
                      },
                    },
                  ],
                },
                {
                  // 720p output
                  NameModifier: '720p',
                  ContainerSettings: {
                    Container: 'MPD',
                  },
                  VideoDescription: {
                    Width: 1280,
                    Height: 720,
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        RateControlMode: 'QVBR',
                        QvbrSettings: {
                          QvbrQualityLevel: 8,
                        },
                        MaxBitrate: 3000000,
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 96000,
                          CodingMode: 'CODING_MODE_2_0',
                          SampleRate: 48000,
                        },
                      },
                    },
                  ],
                },
                {
                  // 480p output
                  NameModifier: '480p',
                  ContainerSettings: {
                    Container: 'MPD',
                  },
                  VideoDescription: {
                    Width: 854,
                    Height: 480,
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        RateControlMode: 'QVBR',
                        QvbrSettings: {
                          QvbrQualityLevel: 7,
                        },
                        MaxBitrate: 1500000,
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 96000,
                          CodingMode: 'CODING_MODE_2_0',
                          SampleRate: 48000,
                        },
                      },
                    },
                  ],
                },
                {
                  // 360p output
                  NameModifier: '360p',
                  ContainerSettings: {
                    Container: 'MPD',
                  },
                  VideoDescription: {
                    Width: 640,
                    Height: 360,
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        RateControlMode: 'QVBR',
                        QvbrSettings: {
                          QvbrQualityLevel: 6,
                        },
                        MaxBitrate: 750000,
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 64000,
                          CodingMode: 'CODING_MODE_2_0',
                          SampleRate: 48000,
                        },
                      },
                    },
                  ],
                },
              ],
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

