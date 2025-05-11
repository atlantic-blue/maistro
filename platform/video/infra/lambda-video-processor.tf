# Takes an mp4 video and convers it to dash and hls

resource "aws_iam_role" "video_processor" {
  name = "${var.platform_name}-processor-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
  
  tags = local.tags
}

resource "aws_iam_role_policy" "video_processor_logs" {
  name = "${var.platform_name}-basic-policy"
  role = aws_iam_role.video_processor.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "video_processor_s3" {
  name = "${var.platform_name}-processor-s3"
  role = aws_iam_role.video_processor.id
  
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "s3:Get*",
        ],
        Effect : "Allow",
        Resource : [
          "${aws_s3_bucket.video_input.arn}/*",
          ]
      },
      {
        Action : [
          "s3:Put*",
        ],
        Effect : "Allow",
        Resource : [
          "${aws_s3_bucket.video_output.arn}/*",
          ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "video_processor_media_convert" {
  name = "${var.platform_name}-processor-media-convert"
  role = aws_iam_role.video_processor.id
  
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "mediaconvert:*",
        ],
        Effect : "Allow",
        Resource : "*"
      },
      {
        Action : "iam:PassRole",
        Effect : "Allow",
        Resource : "${aws_iam_role.mediaconvert_role.arn}"
      }
    ]
  })
}

data "archive_file" "video_processor" {
  type        = "zip"
  source_dir  = local.source_dir_path
  output_path = local.output_path
}

// Store the lambda in s3
resource "aws_s3_object" "video_processor" {
  bucket = aws_s3_bucket.video_output.id

  key    = "${var.platform_name}-processor.zip"
  source = data.archive_file.video_processor.output_path

  etag = filemd5(data.archive_file.video_processor.output_path)
}

resource "aws_lambda_function" "video_processor" {
  function_name = "${var.platform_name}-processor"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.video_output.id
  s3_key    = aws_s3_object.video_processor.key

  role             = aws_iam_role.video_processor.arn
  source_code_hash = data.archive_file.video_processor.output_base64sha256

  environment {
    variables = {
      MEDIACONVERT_ENDPOINT = "https://mediaconvert.${var.aws_region}.amazonaws.com"
      MEDIACONVERT_ROLE = aws_iam_role.mediaconvert_role.arn
      MEDIACONVERT_QUEUE = aws_media_convert_queue.queue.id
      OUTPUT_BUCKET = aws_s3_bucket.video_output.bucket
    }
  }

  tags = merge(
    local.tags,
    {
      managedBy = "Terraform",
    }
  )
}

## LOGS
resource "aws_cloudwatch_log_group" "video_processor" {
  name              = "/aws/lambda/${aws_lambda_function.video_processor.function_name}"
  retention_in_days = 1
  lifecycle {
    prevent_destroy = false
  }
}
