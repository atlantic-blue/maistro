## PUBLIC ENDPOINT

# IAM ROLE
data "aws_iam_policy_document" "api_lambda_orders_webhook_stripe" {
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

resource "aws_iam_role" "api_lambda_orders_webhook_stripe" {
  name               = "${local.api_bucket_name}-orders-webhook-stripe"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_orders_webhook_stripe.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_orders_webhook_stripe_logs" {
  name = "${local.api_bucket_name}-orders-webhook-stripe-logs"
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

resource "aws_iam_role_policy_attachment" "api_lambda_orders_webhook_stripe_logs" {
  role       = aws_iam_role.api_lambda_orders_webhook_stripe.id
  policy_arn = aws_iam_policy.api_lambda_orders_webhook_stripe_logs.arn
}


resource "aws_iam_policy" "api_lambda_orders_webhook_stripe_dynamo" {
  name = "${local.api_bucket_name}-orders-webhook-stripe-dynamo"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "dynamodb:UpdateItem"
        ],
        Effect : "Allow",
        Resource : [
          "${aws_dynamodb_table.orders.arn}",
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_orders_webhook_stripe_dynamo" {
  role       = aws_iam_role.api_lambda_orders_webhook_stripe.id
  policy_arn = aws_iam_policy.api_lambda_orders_webhook_stripe_dynamo.arn
}

resource "aws_iam_policy" "api_lambda_orders_webhook_stripe_ses" {
  name = "${local.api_bucket_name}-orders-webhook-stripe-ses"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ],
        Effect : "Allow",
        Resource = "*",
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_orders_webhook_stripe_ses" {
  role       = aws_iam_role.api_lambda_orders_webhook_stripe.id
  policy_arn = aws_iam_policy.api_lambda_orders_webhook_stripe_ses.arn
}

## LAMBDA
data "archive_file" "api_lambda_orders_webhook_stripe" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/orders-webhook-stripe"
  output_path = "${path.module}/orders-webhook-stripe.zip"
}


resource "aws_s3_object" "api_lambda_orders_webhook_stripe" {
  bucket = aws_s3_bucket.api.id

  key    = "orders-webhook-stripe.zip"
  source = data.archive_file.api_lambda_orders_webhook_stripe.output_path

  etag = filemd5(data.archive_file.api_lambda_orders_webhook_stripe.output_path)
}

resource "aws_lambda_function" "api_lambda_orders_webhook_stripe" {
  function_name = "${local.api_bucket_name}-orders-webhook-stripe"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.api_lambda_orders_webhook_stripe.key

  role             = aws_iam_role.api_lambda_orders_webhook_stripe.arn
  source_code_hash = data.archive_file.api_lambda_orders_webhook_stripe.output_base64sha256

  environment {
    variables = {
      TABLE_NAME                  = "${aws_dynamodb_table.orders.name}"
      PAYMENTS_SECRET_KEY         = "${var.payments_secret_key}"
      PAYMENTS_WEBHOOK_SECRET_KEY = "${var.payments_webhook_secret_key}"
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
resource "aws_cloudwatch_log_group" "api_lambda_orders_webhook_stripe" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda_orders_webhook_stripe.function_name}"
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
resource "aws_apigatewayv2_integration" "api_lambda_orders_webhook_stripe" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda_orders_webhook_stripe.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda_orders_webhook_stripe" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /orders/stripe"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda_orders_webhook_stripe.id}"
}

resource "aws_lambda_permission" "api_lambda_orders_webhook_stripe" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda_orders_webhook_stripe.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
