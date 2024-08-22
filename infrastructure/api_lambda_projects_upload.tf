# IAM ROLE
data "aws_iam_policy_document" "api_lambda_projects_upload" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_role" "api_lambda_projects_upload" {
  name               = "${local.api_bucket_name}-projects-upload"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_projects_upload.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_projects_upload_logs" {
  name = "${local.api_bucket_name}-projects-upload-logs"
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

resource "aws_iam_role_policy_attachment" "api_lambda_projects_upload_logs" {
  role       = aws_iam_role.api_lambda_projects_upload.id
  policy_arn = aws_iam_policy.api_lambda_projects_upload_logs.arn
}

resource "aws_iam_policy" "api_lambda_projects_upload_s3" {
  name = "${local.api_bucket_name}-projects-upload-s3"
   policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "s3:Put*",
        ],
        Effect : "Allow",
        Resource : ["${aws_s3_bucket.hosting.arn}/*"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_projects_upload_s3" {
  role       = aws_iam_role.api_lambda_projects_upload.id
  policy_arn = aws_iam_policy.api_lambda_projects_upload_s3.arn
}

## LAMBDA
data "archive_file" "api_lambda_projects_upload" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/projects-upload"
  output_path = "${path.module}/projects-upload.zip"
}


resource "aws_s3_object" "api_lambda_projects_upload" {
  bucket = aws_s3_bucket.api.id

  key    = "projects-upload.zip"
  source = data.archive_file.api_lambda_projects_upload.output_path

  etag = filemd5(data.archive_file.api_lambda_projects_upload.output_path)
}

resource "aws_lambda_function" "api_lambda_projects_upload" {
  function_name = "${local.api_bucket_name}-projects-upload"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.api_lambda_projects_upload.key

  role             = aws_iam_role.api_lambda_projects_upload.arn
  source_code_hash = data.archive_file.api_lambda_projects_upload.output_base64sha256

  environment {
    variables = {
      BUCKET_NAME = "${aws_s3_bucket.hosting.bucket}"
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
resource "aws_cloudwatch_log_group" "api_lambda_projects_upload" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda_projects_upload.function_name}"
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

## API GATEWAY
resource "aws_apigatewayv2_integration" "api_lambda_projects_upload" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda_projects_upload.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda_projects_upload" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /projects/{project-id}/upload"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda_projects_upload.id}"
}

resource "aws_lambda_permission" "api_lambda_projects_upload" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda_projects_upload.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
