## PUBLIC ENDPOINT

# IAM ROLE
data "aws_iam_policy_document" "api_lambda_orders_webhook_mercado_pago" {
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

resource "aws_iam_role" "api_lambda_orders_webhook_mercado_pago" {
  name               = "${local.api_bucket_name}-orders-webhook-mercado-pago"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_orders_webhook_mercado_pago.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_orders_webhook_mercado_pago_logs" {
  name = "${local.api_bucket_name}-orders-webhook-mercado-pago-logs"
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

resource "aws_iam_role_policy_attachment" "api_lambda_orders_webhook_mercado_pago_logs" {
  role       = aws_iam_role.api_lambda_orders_webhook_mercado_pago.id
  policy_arn = aws_iam_policy.api_lambda_orders_webhook_mercado_pago_logs.arn
}


resource "aws_iam_policy" "api_lambda_orders_webhook_mercado_pago_dynamo" {
  name = "${local.api_bucket_name}-orders-webhook-mercado-pago-dynamo"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
        ],
        Effect : "Allow",
        Resource : [
          "${aws_dynamodb_table.orders.arn}",
          "${aws_dynamodb_table.orders.arn}/index/*",
          "${aws_dynamodb_table.projects.arn}",
          "${aws_dynamodb_table.projects.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_orders_webhook_mercado_pago_dynamo" {
  role       = aws_iam_role.api_lambda_orders_webhook_mercado_pago.id
  policy_arn = aws_iam_policy.api_lambda_orders_webhook_mercado_pago_dynamo.arn
}

resource "aws_iam_policy" "api_lambda_orders_webhook_mercado_pago_ses" {
  name = "${local.api_bucket_name}-orders-webhook-mercado-pago-ses"
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

resource "aws_iam_role_policy_attachment" "api_lambda_orders_webhook_mercado_pago_ses" {
  role       = aws_iam_role.api_lambda_orders_webhook_mercado_pago.id
  policy_arn = aws_iam_policy.api_lambda_orders_webhook_mercado_pago_ses.arn
}

## LAMBDA
data "archive_file" "api_lambda_orders_webhook_mercado_pago" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/orders-webhook-mercado-pago"
  output_path = "${path.module}/orders-webhook-mercado-pago.zip"
}


resource "aws_s3_object" "api_lambda_orders_webhook_mercado_pago" {
  bucket = aws_s3_bucket.api.id

  key    = "orders-webhook-mercado-pago.zip"
  source = data.archive_file.api_lambda_orders_webhook_mercado_pago.output_path

  etag = filemd5(data.archive_file.api_lambda_orders_webhook_mercado_pago.output_path)
}

resource "aws_lambda_function" "api_lambda_orders_webhook_mercado_pago" {
  function_name = "${local.api_bucket_name}-orders-webhook-mercado-pago"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.api_lambda_orders_webhook_mercado_pago.key

  role             = aws_iam_role.api_lambda_orders_webhook_mercado_pago.arn
  source_code_hash = data.archive_file.api_lambda_orders_webhook_mercado_pago.output_base64sha256

  timeout = 60 * 2 // 2 minutes

  environment {
    variables = {
      TABLE_NAME_ORDERS           = "${aws_dynamodb_table.orders.name}"
      TABLE_NAME_PROJECTS         = "${aws_dynamodb_table.projects.name}"
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
resource "aws_cloudwatch_log_group" "api_lambda_orders_webhook_mercado_pago" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda_orders_webhook_mercado_pago.function_name}"
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
resource "aws_apigatewayv2_integration" "api_lambda_orders_webhook_mercado_pago" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda_orders_webhook_mercado_pago.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda_orders_webhook_mercado_pago" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /orders/mercado-pago"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda_orders_webhook_mercado_pago.id}"
}

resource "aws_lambda_permission" "api_lambda_orders_webhook_mercado_pago" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda_orders_webhook_mercado_pago.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
