# IAM ROLE
data "aws_iam_policy_document" "hosting_lambda_redirect" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_role" "hosting_lambda_redirect" {
  name               = "${local.api_bucket_name}-redirect"
  assume_role_policy = data.aws_iam_policy_document.hosting_lambda_redirect.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "hosting_lambda_redirect" {
  name = "${local.api_bucket_name}-redirect"
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

resource "aws_iam_role_policy_attachment" "hosting_lambda_redirect" {
  role       = aws_iam_role.hosting_lambda_redirect.id
  policy_arn = aws_iam_policy.hosting_lambda_redirect.arn
}


## LAMBDA
data "archive_file" "hosting_lambda_redirect" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/hosting-redirect"
  output_path = "${path.module}/hosting-redirect.zip"
}


resource "aws_s3_object" "hosting_lambda_redirect" {
  bucket = aws_s3_bucket.api.id

  key    = "hosting-redirect.zip"
  source = data.archive_file.hosting_lambda_redirect.output_path

  etag = filemd5(data.archive_file.hosting_lambda_redirect.output_path)
}

resource "aws_lambda_function" "hosting_lambda_redirect" {
  publish = true
  #   provider = aws.us_east_1

  function_name = "${local.api_bucket_name}-redirect"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.hosting_lambda_redirect.key

  role             = aws_iam_role.hosting_lambda_redirect.arn
  source_code_hash = data.archive_file.hosting_lambda_redirect.output_base64sha256

  environment {
    variables = {

    }
  }

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

## LOGS
resource "aws_cloudwatch_log_group" "hosting_lambda_redirect" {
  name              = "/aws/lambda/${aws_lambda_function.hosting_lambda_redirect.function_name}"
  retention_in_days = 1
  lifecycle {
    prevent_destroy = false
  }
}
