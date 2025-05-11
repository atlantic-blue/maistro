import {S3, MediaConvert} from "aws-sdk"
import { S3Event } from 'aws-lambda';
import path from "path"
import { createMediaConvertJob } from "./mediaConvertJob";

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
