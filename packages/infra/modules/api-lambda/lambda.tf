# IAM ROLE
data "aws_iam_policy_document" "api_lambda" {
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

resource "aws_iam_role" "api_lambda" {
  name               = "${var.lambda_name}"
  assume_role_policy = data.aws_iam_policy_document.api_lambda.json

  tags = var.tags
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_logs" {
  name = "${var.lambda_name}-logs"
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

resource "aws_iam_role_policy_attachment" "api_lambda_logs" {
  role       = aws_iam_role.api_lambda.id
  policy_arn = aws_iam_policy.api_lambda_logs.arn
}

## LAMBDA
data "archive_file" "api_lambda" {
  type = "zip"

  source_dir  = "${var.input_dir}"
  output_path = "${var.output_path}"
}


resource "aws_s3_object" "api_lambda" {
  bucket = var.apigateway_bucket_id

  key    = "${var.lambda_name}.zip"
  source = data.archive_file.api_lambda.output_path

  etag = filemd5(data.archive_file.api_lambda.output_path)
}

resource "aws_lambda_function" "api_lambda" {
  function_name = "${var.lambda_name}"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = var.apigateway_bucket_id
  s3_key    = aws_s3_object.api_lambda.key

  role             = aws_iam_role.api_lambda.arn
  source_code_hash = data.archive_file.api_lambda.output_base64sha256

  timeout     = 60 * 15 // 15 minutes // TODO make configurable.
  memory_size = 1024 // TODO make configurable. before 128 * 4

  environment {
    variables = var.lambda_env_variables
  }

  tags = var.tags
}

## LOGS
resource "aws_cloudwatch_log_group" "api_lambda" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda.function_name}"
  retention_in_days = 1

  lifecycle {
    prevent_destroy = false
  }

  tags = var.tags
}

## API GATEWAY
resource "aws_apigatewayv2_integration" "api_lambda" {
  api_id = var.apigateway_id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda" {
  for_each  = toset(var.route_keys)

  api_id    = var.apigateway_id
  route_key = each.value

  target = "integrations/${aws_apigatewayv2_integration.api_lambda.id}"
}

resource "aws_lambda_permission" "api_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${var.apigateway_execution_arn}/*/*"
}
