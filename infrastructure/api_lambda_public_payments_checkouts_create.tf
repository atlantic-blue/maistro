## PUBLIC ENDPOINT

# IAM ROLE
data "aws_iam_policy_document" "api_lambda_payments_checkouts_create" {
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

resource "aws_iam_role" "api_lambda_payments_checkouts_create" {
  name               = "${local.api_bucket_name}-payments-checkouts-create"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_payments_checkouts_create.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_payments_checkouts_create_logs" {
  name = "${local.api_bucket_name}-payments-checkouts-create"
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

resource "aws_iam_role_policy_attachment" "api_lambda_payments_checkouts_create_logs" {
  role       = aws_iam_role.api_lambda_payments_checkouts_create.id
  policy_arn = aws_iam_policy.api_lambda_payments_checkouts_create_logs.arn
}


resource "aws_iam_policy" "api_lambda_payments_checkouts_create_dynamo" {
  name = "${local.api_bucket_name}-payments_checkouts_create"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "dynamodb:PutItem"
        ],
        Effect : "Allow",
        Resource : [
          "${aws_dynamodb_table.payments_checkouts.arn}",
          "${aws_dynamodb_table.payments_checkouts.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_payments_checkouts_create_dynamo" {
  role       = aws_iam_role.api_lambda_payments_checkouts_create.id
  policy_arn = aws_iam_policy.api_lambda_payments_checkouts_create_dynamo.arn
}

## LAMBDA
data "archive_file" "api_lambda_payments_checkouts_create" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/payments-checkouts-create"
  output_path = "${path.module}/payments-checkouts-create.zip"
}


resource "aws_s3_object" "api_lambda_payments_checkouts_create" {
  bucket = aws_s3_bucket.api.id

  key    = "payments-checkouts-create.zip"
  source = data.archive_file.api_lambda_payments_checkouts_create.output_path

  etag = filemd5(data.archive_file.api_lambda_payments_checkouts_create.output_path)
}

resource "aws_lambda_function" "api_lambda_payments_checkouts_create" {
  function_name = "${local.api_bucket_name}-payments-checkouts-create"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.api_lambda_payments_checkouts_create.key

  role             = aws_iam_role.api_lambda_payments_checkouts_create.arn
  source_code_hash = data.archive_file.api_lambda_payments_checkouts_create.output_base64sha256

  environment {
    variables = {
      PAYMENTS_SECRET_KEY = "${var.payments_secret_key}"
      TABLE_NAME          = "${aws_dynamodb_table.payments_checkouts.name}"
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
resource "aws_cloudwatch_log_group" "api_lambda_payments_checkouts_create" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda_payments_checkouts_create.function_name}"
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
resource "aws_apigatewayv2_integration" "api_lambda_payments_checkouts_create" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda_payments_checkouts_create.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda_payments_checkouts_create" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /payments/checkouts"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda_payments_checkouts_create.id}"
}

resource "aws_lambda_permission" "api_lambda_payments_checkouts_create" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda_payments_checkouts_create.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
