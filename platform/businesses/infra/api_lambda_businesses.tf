module "platform_businesses_lambda_businesses" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = module.platform_businesses_api.apigateway.execution_arn
  apigateway_id            = module.platform_businesses_api.apigateway.id
  apigateway_bucket_id     = module.platform_businesses_api.api_bucket.id

  lambda_name = "${module.platform_businesses_api.api_bucket.bucket}-businesses"
  route_keys = [
    "POST /businesses/onboarding",

    "GET /businesses",

    "GET /businesses/{businessSlug}/profile",
    "PUT /businesses/{businessId}/profile",
  ]
  input_dir   = "${path.module}/../backend/dist/businesses"
  output_path = "${path.module}/lambdas/businesses.zip"
  lambda_env_variables = {
      BUSINESSES_TABLE         = aws_dynamodb_table.maistro_businesses.name
      USERS_TABLE = var.users_table_name
  }

  tags = local.tags
}

resource "aws_iam_policy" "platform_businesses_lambda_businesses_dynamo" {
  name = "${module.platform_businesses_api.api_bucket.bucket}-businesses-dynamo"
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
          "${aws_dynamodb_table.maistro_businesses.arn}",
          "${aws_dynamodb_table.maistro_businesses.arn}/index/*",
          "${var.users_table_arn}",
          "${var.users_table_arn}/index/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "platform_businesses_lambda_businesses_dynamo" {
  role = module.platform_businesses_lambda_businesses.aws_iam_role.id
  policy_arn = aws_iam_policy.platform_businesses_lambda_businesses_dynamo.arn
}
