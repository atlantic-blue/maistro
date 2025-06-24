module "products_chat_api_lambda_meta_oauth_callback" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = "${module.products_chat_api.apigateway.execution_arn}"
  apigateway_id = "${module.products_chat_api.apigateway.id}" 
  apigateway_bucket_id = "${module.products_chat_api.api_bucket.id}"

  lambda_name = "${module.products_chat_api.api_bucket.bucket}-meta-oauth-callback"
  route_keys = ["GET /meta/callback"]
  input_dir = "${path.module}/../backend/dist/meta-oauth-callback"
  output_path =  "${path.module}/lambdas/meta-oauth-callback.zip"
  lambda_env_variables = {
    FB_APP_ID = var.meta_webhook_fb_app_id
    FB_APP_SECRET = var.meta_webhook_fb_app_secret
    REDIRECT_URI = "https://maistro-chats-api-production.maistro.website/v1/meta/callback"
  }

  tags = local.tags
}
