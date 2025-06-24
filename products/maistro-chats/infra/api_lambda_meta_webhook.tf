module "products_chat_api_lambda_meta_webhook" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = "${module.products_chat_api.apigateway.execution_arn}"
  apigateway_id = "${module.products_chat_api.apigateway.id}" 
  apigateway_bucket_id = "${module.products_chat_api.api_bucket.id}"

  lambda_name = "${module.products_chat_api.api_bucket.bucket}-meta-webhook"
  route_keys = ["POST /meta/webhook", "GET /meta/webhook"]
  input_dir = "${path.module}/../backend/dist/meta-webhook"
  output_path =  "${path.module}/lambdas/meta-webhook.zip"
  lambda_env_variables = {
    META_VERIFY_TOKEN = var.meta_webhook_verify_token
  }

  tags = local.tags
}
