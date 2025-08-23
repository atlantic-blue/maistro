
data "aws_iam_policy_document" "www_lambda_ssr" {
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

resource "aws_iam_role" "www_lambda_ssr" {
  name               = "www_lambda_ssr"
  assume_role_policy = data.aws_iam_policy_document.www_lambda_ssr.json

  tags = local.tags
}

resource "aws_iam_policy" "www_lambda_ssr" {
  name = "www_lambda_ssr"
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

resource "aws_iam_role_policy_attachment" "www_lambda_ssr" {
  role       = aws_iam_role.www_lambda_ssr.id
  policy_arn = aws_iam_policy.www_lambda_ssr.arn
}

# Archive lambda function
data "archive_file" "www_lambda_ssr" {
  type        = "zip"
  # The output directory of the lambda
  source_dir  = "${path.module}/../backend-ssr/dist-server"
  output_path = "${path.module}/lambdas/server-side-render.zip"
}

resource "aws_lambda_function" "www_lambda_ssr" {
  function_name = "${var.product_name}-hosting-${var.environment}-www_lambda_ssr"
  filename      = "${path.module}/lambdas/server-side-render.zip"

  handler = "index.handler"
  runtime = "nodejs20.x"

  role             = aws_iam_role.www_lambda_ssr.arn
  source_code_hash = data.archive_file.www_lambda_ssr.output_base64sha256

  timeout     = 60 * 5 // 5 minutes
  #   memory_size = 128 * 4

  environment {
    variables = {

    }
  }

  tags = local.tags
}

## LOGS
resource "aws_cloudwatch_log_group" "www_lambda_ssr" {
  name              = "/aws/lambda/${aws_lambda_function.www_lambda_ssr.function_name}"
  retention_in_days = 1

  lifecycle {
    prevent_destroy = false
  }

  tags = local.tags
}

# Lambda URL
resource "aws_lambda_function_url" "www_lambda_ssr" {
  function_name = aws_lambda_function.www_lambda_ssr.function_name
  # TODO add "IAM" for production
  authorization_type = "NONE"
}

output "www_lambda_ssr" {
  description = "www_lambda_ssr_url"
  value       = aws_lambda_function_url.www_lambda_ssr.function_url
}
