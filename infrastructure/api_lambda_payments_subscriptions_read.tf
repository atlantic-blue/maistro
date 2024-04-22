# IAM ROLE
data "aws_iam_policy_document" "api_lambda_payments_subscriptions-read" {
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

resource "aws_iam_role" "api_lambda_payments_subscriptions-read" {
  name               = "${local.api_bucket_name}-payments-subscriptions-read"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_payments_subscriptions-read.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_payments_subscriptions-read_logs" {
  name = "${local.api_bucket_name}-payments-subscriptions-read-logs"
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

resource "aws_iam_role_policy_attachment" "api_lambda_payments_subscriptions-read_logs" {
  role       = aws_iam_role.api_lambda_payments_subscriptions-read.id
  policy_arn = aws_iam_policy.api_lambda_payments_subscriptions-read_logs.arn
}

## LAMBDA
data "archive_file" "api_lambda_payments_subscriptions-read" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/payments-subscriptions-read"
  output_path = "${path.module}/payments-subscriptions-read.zip"
}


resource "aws_s3_object" "api_lambda_payments_subscriptions-read" {
  bucket = aws_s3_bucket.api.id

  key    = "payments-subscriptions-read.zip"
  source = data.archive_file.api_lambda_payments_subscriptions-read.output_path

  etag = filemd5(data.archive_file.api_lambda_payments_subscriptions-read.output_path)
}

resource "aws_lambda_function" "api_lambda_payments_subscriptions-read" {
  function_name = "${local.api_bucket_name}-payments-subscriptions-read"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.api_lambda_payments_subscriptions-read.key

  role             = aws_iam_role.api_lambda_payments_subscriptions-read.arn
  source_code_hash = data.archive_file.api_lambda_payments_subscriptions-read.output_base64sha256

  environment {
    variables = {
      PAYMENTS_SECRET_KEY = "${var.payments_secret_key}"
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
resource "aws_cloudwatch_log_group" "api_lambda_payments_subscriptions-read" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda_payments_subscriptions-read.function_name}"
  retention_in_days = 1
  lifecycle {
    prevent_destroy = false
  }
}

## API GATEWAY
resource "aws_apigatewayv2_integration" "api_lambda_payments_subscriptions-read" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda_payments_subscriptions-read.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda_payments_subscriptions-read" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /payments/subscriptions"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda_payments_subscriptions-read.id}"
}

resource "aws_lambda_permission" "api_lambda_payments_subscriptions-read" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda_payments_subscriptions-read.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
