# IAM ROLE
data "aws_iam_policy_document" "event_lambda_users_crate" {
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

resource "aws_iam_role" "event_lambda_users_crate" {
  name               = "${local.api_bucket_name}-users-create"
  assume_role_policy = data.aws_iam_policy_document.event_lambda_users_crate.json
  tags               = local.tags
}

# IAM POLICY
resource "aws_iam_policy" "event_lambda_users_crate_logs" {
  name = "${local.api_bucket_name}-users-create"
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

resource "aws_iam_role_policy_attachment" "event_lambda_users_crate_logs" {
  role       = aws_iam_role.event_lambda_users_crate.id
  policy_arn = aws_iam_policy.event_lambda_users_crate_logs.arn
}

# IAM POLICY DYNAMO
resource "aws_iam_policy" "event_lambda_users_crate_dynamo" {
  name = "${local.api_bucket_name}-users-create-dynamo"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:BatchGetItem"
        ],
        Effect : "Allow",
        Resource : [
          "${aws_dynamodb_table.maistro_users.arn}",
          "${aws_dynamodb_table.maistro_users.arn}/index/*",
          "${aws_dynamodb_table.maistro_user_profiles.arn}",
          "${aws_dynamodb_table.maistro_user_profiles.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "event_lambda_users_crate_dynamo" {
  role       = aws_iam_role.event_lambda_users_crate.id
  policy_arn = aws_iam_policy.event_lambda_users_crate_dynamo.arn
}

## LAMBDA
data "archive_file" "event_lambda_users_crate" {
  type = "zip"

  source_dir  = "${path.module}/../backend/dist/users-create"
  output_path = "${path.module}/lambdas/users-create.zip"
}

resource "aws_s3_object" "event_lambda_users_crate" {
  bucket = module.platform_users_api.api_bucket.id

  key    = "users-create.zip"
  source = data.archive_file.event_lambda_users_crate.output_path

  etag = filemd5(data.archive_file.event_lambda_users_crate.output_path)
}

resource "aws_lambda_function" "event_lambda_users_crate" {
  function_name = "${local.api_bucket_name}-users-create"

  handler = "index.handler"
  runtime = "nodejs20.x"

  s3_bucket = module.platform_users_api.api_bucket.id
  s3_key    = aws_s3_object.event_lambda_users_crate.key

  role             = aws_iam_role.event_lambda_users_crate.arn
  source_code_hash = data.archive_file.event_lambda_users_crate.output_base64sha256

  environment {
    variables = {
      USERS_TABLE         = aws_dynamodb_table.maistro_users.name
      USER_PROFILES_TABLE = aws_dynamodb_table.maistro_user_profiles.name
      ENVIRONMENT         = var.environment
    }
  }

  tags = local.tags
}

## LOGS
resource "aws_cloudwatch_log_group" "event_lambda_users_crate" {
  name              = "/aws/lambda/${aws_lambda_function.event_lambda_users_crate.function_name}"
  retention_in_days = 1
  lifecycle {
    prevent_destroy = false
  }

  tags = local.tags
}