module "platform_lambda_images" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = module.platform_api.apigateway.execution_arn
  apigateway_id            = module.platform_api.apigateway.id
  apigateway_bucket_id     = module.platform_api.api_bucket.id

  lambda_name = "${module.platform_api.api_bucket.bucket}-images"
  route_keys = [
    "POST /signedUrl",
    "POST /resize",

    "GET /images",
    "GET /usage",
  ]

  input_dir   = "${path.module}/../backend/dist/images"
  output_path = "${path.module}/lambdas/images.zip"

  lambda_env_variables = {
      IMAGES_TABLE         = aws_dynamodb_table.maistro_images.name
      IMAGES_USAGE_TABLE = aws_dynamodb_table.maistro_images_usage.name
      S3_BUCKET = module.hosting.www_bucket
      HOSTING_DOMAIN_URL = var.domain_name
  }

  lambda_timeout = 60 * 15 // 15 minutes
  lambda_memory_size = 1024

  tags = local.tags
}

resource "aws_iam_policy" "platform_lambda_images_dynamo" {
  name = "${module.platform_api.api_bucket.bucket}-images-dynamo"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:BatchGetItem",
        ],
        Effect : "Allow",
        Resource : [
          "${aws_dynamodb_table.maistro_images.arn}",
          "${aws_dynamodb_table.maistro_images.arn}/index/*",
          "${aws_dynamodb_table.maistro_images_usage.arn}",
          "${aws_dynamodb_table.maistro_images_usage.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "platform_lambda_images_dynamo" {
  role = module.platform_lambda_images.aws_iam_role.id
  policy_arn = aws_iam_policy.platform_lambda_images_dynamo.arn
}
