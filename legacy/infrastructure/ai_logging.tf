data "aws_caller_identity" "ai_logging" {}

resource "aws_s3_bucket" "ai_logging" {
  bucket        = local.ai_bucket_name
  force_destroy = true
  lifecycle {
    ignore_changes = [
      tags["CreatorId"], tags["CreatorName"],
    ]
  }

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "ai_logging" {
  bucket = aws_s3_bucket.ai_logging.id

  rule {
    id = aws_s3_bucket.ai_logging.bucket

    expiration {
      days = 1
    }

    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "ai_logging" {
  bucket = aws_s3_bucket.ai_logging.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "ai_logging_bucket" {
  statement {
    actions = [
      "s3:*"
    ]
    resources = [
      "${aws_s3_bucket.ai_logging.arn}/*"
    ]

    principals {
      type        = "Service"
      identifiers = ["bedrock.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"

      values = [
        "${data.aws_caller_identity.ai_logging.account_id}"
      ]
    }

    condition {
      test     = "ArnLike"
      variable = "aws:SourceArn"

      values = [
        "arn:aws:bedrock:us-east-1:${data.aws_caller_identity.ai_logging.account_id}:*"
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "ai_logging" {
  bucket = aws_s3_bucket.ai_logging.id
  policy = data.aws_iam_policy_document.ai_logging_bucket.json
}

#Cloudwatch
data "aws_iam_policy_document" "ai_logging_cloudwatch" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["bedrock.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_role" "ai_logging" {
  name               = "${local.api_bucket_name}-ai-logging"
  assume_role_policy = data.aws_iam_policy_document.ai_logging_cloudwatch.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_iam_policy" "ai_logging" {
  name = "${local.api_bucket_name}-ai-logging"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",

        ],
        Effect : "Allow",
        Resource : ["*"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ai_logging" {
  role       = aws_iam_role.ai_logging.id
  policy_arn = aws_iam_policy.ai_logging.arn
}


resource "aws_cloudwatch_log_group" "ai_logging" {
  name              = "${local.api_bucket_name}-ai-logging"
  retention_in_days = 1

  lifecycle {
    prevent_destroy = false
  }

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_bedrock_model_invocation_logging_configuration" "ai_logging" {
  depends_on = [
    aws_s3_bucket_policy.ai_logging
  ]

  logging_config {
    embedding_data_delivery_enabled = true
    image_data_delivery_enabled     = true
    text_data_delivery_enabled      = true

    cloudwatch_config {
      role_arn       = aws_iam_role.ai_logging.arn
      log_group_name = aws_cloudwatch_log_group.ai_logging.name

      large_data_delivery_s3_config {
        bucket_name = aws_s3_bucket.ai_logging.id
        key_prefix  = "bedrock"
      }
    }

    s3_config {
      bucket_name = aws_s3_bucket.ai_logging.id
      key_prefix  = "bedrock"
    }
  }
}
