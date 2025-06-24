## Sub Domain API for Maistro products

```hcl
module "products_chat_api_lambda_webhook" {
  source = "../../../packages/infra/modules/api-lambda"
  apigateway_execution_arn = "${module.products_chat_api.apigateway.execution_arn}"
  apigateway_id = "${module.products_chat_api.apigateway.id}" 

  lambda_name = "webhook"
  lambda_route_key = "POST /webhook"
  input_dir = "${path.module}/../backend/lambdas/dist/webhook"
  output_path = "${path.module}/lambdas/webhook.zip"
  lambda_env_variables = {    
  }

  tags = local.tags
}
```
