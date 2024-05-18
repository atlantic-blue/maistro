# IAM ROLE
data "aws_iam_policy_document" "api_lambda_payments_accounts_link_create" {
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

resource "aws_iam_role" "api_lambda_payments_accounts_link_create" {
  name               = "${local.api_bucket_name}-payments-accounts-link-create"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_payments_accounts_link_create.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_payments_accounts_link_create_logs" {
  name = "${local.api_bucket_name}-payments-accounts-link-create"
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

resource "aws_iam_role_policy_attachment" "api_lambda_payments_accounts_link_create_logs" {
  role       = aws_iam_role.api_lambda_payments_accounts_link_create.id
  policy_arn = aws_iam_policy.api_lambda_payments_accounts_link_create_logs.arn
}

## LAMBDA
data "archive_file" "api_lambda_payments_accounts_link_create" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/payments-accounts-link-create"
  output_path = "${path.module}/payments-accounts-link-create"
}


resource "aws_s3_object" "api_lambda_payments_accounts_link_create" {
  bucket = aws_s3_bucket.api.id

  key    = "payments-accounts-link-create"
  source = data.archive_file.api_lambda_payments_accounts_link_create.output_path

  etag = filemd5(data.archive_file.api_lambda_payments_accounts_link_create.output_path)
}

resource "aws_lambda_function" "api_lambda_payments_accounts_link_create" {
  function_name = "${local.api_bucket_name}-payments-accounts-link-create"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.api_lambda_payments_accounts_link_create.key

  role             = aws_iam_role.api_lambda_payments_accounts_link_create.arn
  source_code_hash = data.archive_file.api_lambda_payments_accounts_link_create.output_base64sha256

  timeout = 60 * 2 // 2 minutes

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
resource "aws_cloudwatch_log_group" "api_lambda_payments_accounts_link_create" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda_payments_accounts_link_create.function_name}"
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
resource "aws_apigatewayv2_integration" "api_lambda_payments_accounts_link_create" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda_payments_accounts_link_create.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda_payments_accounts_link_create" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /payments/accounts/link"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda_payments_accounts_link_create.id}"
}

resource "aws_lambda_permission" "api_lambda_payments_accounts_link_create" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda_payments_accounts_link_create.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
