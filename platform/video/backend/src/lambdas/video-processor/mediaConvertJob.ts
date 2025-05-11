import { MediaConvert } from "aws-sdk";

export function createMediaConvertJob({
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

