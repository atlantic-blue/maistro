module "platform_lambda_orders" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = module.platform_api.apigateway.execution_arn
  apigateway_id            = module.platform_api.apigateway.id
  apigateway_bucket_id     = module.platform_api.api_bucket.id

  lambda_name = "${module.platform_api.api_bucket.bucket}-orders"
  route_keys = [
    "GET /orders",
    "GET /orders/{orderId}",
    "POST /orders/{orderId}",
    "PUT /orders/{orderId}",
    "PATCH /orders/{orderId}",
  ]
  input_dir   = "${path.module}/../backend/dist/orders"
  output_path = "${path.module}/lambdas/orders.zip"
  lambda_env_variables = {
      ORDERS_TABLE         = aws_dynamodb_table.payments.name
  }

  tags = local.tags
}

resource "aws_iam_policy" "platform_lambda_orders_dynamo" {
  name = "${module.platform_api.api_bucket.bucket}-orders-dynamo"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "dynamodb:GetItem",
          "dynamodb:PostItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:BatchGetItem"
        ],
        Effect : "Allow",
        Resource : [
          "${aws_dynamodb_table.payments.arn}",
          "${aws_dynamodb_table.payments.arn}/index/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "platform_lambda_orders_dynamo" {
  role = module.platform_lambda_orders.aws_iam_role.id
  policy_arn = aws_iam_policy.platform_lambda_orders_dynamo.arn
}
