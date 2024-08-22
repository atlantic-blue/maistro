# IAM ROLE
data "aws_iam_policy_document" "api_lambda_system_users_read" {
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

resource "aws_iam_role" "api_lambda_system_users_read" {
  name               = "${local.api_bucket_name}-system-users-read"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_system_users_read.json

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# IAM POLICY
resource "aws_iam_policy" "api_lambda_system_users_read_logs" {
  name = "${local.api_bucket_name}-system-users-read-logs"
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

resource "aws_iam_role_policy_attachment" "api_lambda_system_users_read_logs" {
  role       = aws_iam_role.api_lambda_system_users_read.id
  policy_arn = aws_iam_policy.api_lambda_system_users_read_logs.arn
}


resource "aws_iam_policy" "api_lambda_system_users_read_cognito" {
  name = "${local.api_bucket_name}-system-users-read-cognito"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action = [
          "cognito-idp:ListUsers",
          "cognito-idp:ListUsersInGroup",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminListGroupsForUser"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_system_users_read_cognito" {
  role       = aws_iam_role.api_lambda_system_users_read.id
  policy_arn = aws_iam_policy.api_lambda_system_users_read_cognito.arn
}

## LAMBDA
data "archive_file" "api_lambda_system_users_read" {
  type = "zip"

  source_dir  = "${path.module}/../packages/api/dist/system-users-read"
  output_path = "${path.module}/system-users-read.zip"
}


resource "aws_s3_object" "api_lambda_system_users_read" {
  bucket = aws_s3_bucket.api.id

  key    = "system-users-read.zip"
  source = data.archive_file.api_lambda_system_users_read.output_path

  etag = filemd5(data.archive_file.api_lambda_system_users_read.output_path)
}

resource "aws_lambda_function" "api_lambda_system_users_read" {
  function_name = "${local.api_bucket_name}-system-users-read"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = aws_s3_bucket.api.id
  s3_key    = aws_s3_object.api_lambda_system_users_read.key

  role             = aws_iam_role.api_lambda_system_users_read.arn
  source_code_hash = data.archive_file.api_lambda_system_users_read.output_base64sha256

  environment {
    variables = {
      USERS_POOL_ID = "${aws_cognito_user_pool.authz.id}"
      USERS_POOL_SYSTEM_GROUP = "${aws_cognito_user_group.authz_cognito_group_role_system.name}"
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
resource "aws_cloudwatch_log_group" "api_lambda_system_users_read" {
  name              = "/aws/lambda/${aws_lambda_function.api_lambda_system_users_read.function_name}"
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
resource "aws_apigatewayv2_integration" "api_lambda_system_users_read" {
  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda_system_users_read.invoke_arn
}

resource "aws_apigatewayv2_route" "api_lambda_system_users_read" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /system/users"

  target = "integrations/${aws_apigatewayv2_integration.api_lambda_system_users_read.id}"
}

resource "aws_lambda_permission" "api_lambda_system_users_read" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda_system_users_read.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
