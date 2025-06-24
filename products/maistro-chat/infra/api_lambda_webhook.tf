module "products_chat_api_lambda_webhook" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = "${module.products_chat_api.apigateway.execution_arn}"
  apigateway_id = "${module.products_chat_api.apigateway.id}" 
  apigateway_bucket_id = "${module.products_chat_api.api_bucket.id}"

  lambda_name = "${module.products_chat_api.api_bucket.bucket}-webhook"
  route_keys = ["POST /webhook", "GET /webhook"]
  input_dir = "${path.module}/../backend/dist/webhook"
  output_path =  "${path.module}/lambdas/webhook.zip"
  lambda_env_variables = {
    META_VERIFY_TOKEN = "Sa44OdyjYDrPlt"
  }

  tags = local.tags
}
