terraform {
  required_version = ">= v1.5.7"

  backend "s3" {
    bucket  = "abs-terraform"
    key     = "maistro-platform-video"
    region  = "us-east-1"
    profile = "atlantic-blue"
    encrypt = true
  }
}


# module "video_processor_lambda" {
#   source = "./modules/lambda"
  
#   function_name = "${var.project_prefix}-video-processor"
#   handler       = "index.handler"
#   runtime       = "nodejs16.x"
#   timeout       = 30
#   memory_size   = 256
  
#   source_dir    = "${path.module}/functions/video-processor"
#   output_path   = "${path.module}/dist/video-processor.zip"
  
#   environment_variables = {
#     INPUT_BUCKET     = aws_s3_bucket.video_input.bucket
#     OUTPUT_BUCKET    = aws_s3_bucket.video_output.bucket
#     MEDIACONVERT_ROLE = aws_iam_role.mediaconvert_role.arn
#     MEDIACONVERT_QUEUE = aws_media_convert_queue.academy_queue.id
#     MEDIACONVERT_ENDPOINT = "https://mediaconvert.${var.aws_region}.amazonaws.com"
#   }
  
#   additional_policy_arns = [
#     "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess",
#     "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
#     "arn:aws:iam::aws:policy/AmazonMediaConvertFullAccess"
#   ]
  
#   tags = {
#     Environment = var.environment
#     Product     = "maistro-academy"
#   }
# }