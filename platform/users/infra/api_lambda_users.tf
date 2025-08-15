module "platform_users_lambda_users" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = module.platform_users_api.apigateway.execution_arn
  apigateway_id            = module.platform_users_api.apigateway.id
  apigateway_bucket_id     = module.platform_users_api.api_bucket.id

  lambda_name = "${module.platform_users_api.api_bucket.bucket}-users"
  route_keys = [
    "POST /onboarding",

    "GET /users",

    "GET /users/{userId}",
    "PUT /users/{userId}",

    "GET /users/{userId}/profile",
    "PUT /users/{userId}/profile",

    "GET /me",
    "GET /me/profile",
  ]
  input_dir   = "${path.module}/../backend/dist/users"
  output_path = "${path.module}/lambdas/users.zip"
  lambda_env_variables = {
      USERS_TABLE         = aws_dynamodb_table.maistro_users.name
      USER_PROFILES_TABLE = aws_dynamodb_table.maistro_user_profiles.name
  }

  tags = local.tags
}

resource "aws_iam_policy" "platform_users_lambda_users_dynamo" {
  name = "${module.platform_users_api.api_bucket.bucket}-users-dynamo"
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

resource "aws_iam_role_policy_attachment" "platform_users_lambda_users_dynamo" {
  role = module.platform_users_lambda_users.aws_iam_role.id
  policy_arn = aws_iam_policy.platform_users_lambda_users_dynamo.arn
}
