data "aws_iam_policy_document" "video_output" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.video_output.arn}/*"
    ]
    principals {
      type = "AWS"
      identifiers = [
        "${aws_cloudfront_origin_access_identity.video.iam_arn}"
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "video_output" {
  bucket = aws_s3_bucket.video_output.id
  policy = data.aws_iam_policy_document.video_output.json
}

# Block public access for both buckets
resource "aws_s3_bucket_ownership_controls" "video_output" {
  bucket = aws_s3_bucket.video_output.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_ownership_controls" "video_input" {
  bucket = aws_s3_bucket.video_input.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "input_bucket_block" {
  bucket                  = aws_s3_bucket.video_input.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "output_bucket_block" {
  bucket                  = aws_s3_bucket.video_output.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "video_input" {
  bucket = "${var.platform_name}-input"

  tags = merge(
    local.tags,
    {
      managedBy = "Terraform",
    }
  )
}

resource "aws_s3_bucket" "video_output" {
  bucket = "${var.platform_name}-output"

  tags = merge(
    local.tags,
    {
      managedBy = "Terraform",
    }
  )
}

# S3 event trigger for video processing
resource "aws_s3_bucket_notification" "input_notification" {
  bucket = aws_s3_bucket.video_input.id
  
  lambda_function {
    lambda_function_arn = aws_lambda_function.video_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".mp4"
  }
  
  depends_on = [
    aws_lambda_permission.allow_s3_video_processor
  ]
}

resource "aws_lambda_permission" "allow_s3_video_processor" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.video_processor.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.video_input.arn
}