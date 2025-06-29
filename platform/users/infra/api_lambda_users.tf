module "platform_users_lambda_users" {
  source = "../../../packages/infra/modules/api-lambda"

  apigateway_execution_arn = "${module.platform_users_api.apigateway.execution_arn}"
  apigateway_id = "${module.platform_users_api.apigateway.id}" 
  apigateway_bucket_id = "${module.platform_users_api.api_bucket.id}"

  lambda_name = "${module.platform_users_api.api_bucket.bucket}-users"
  route_keys = [
    "GET /users",
    "GET /users/{userId}",
    "GET /users/{userId}/profile",
    "PUT /users/{userId}",
    "PUT /users/{userId}/profile",
  ]
  input_dir = "${path.module}/../backend/dist/users"
  output_path =  "${path.module}/lambdas/users.zip"
  lambda_env_variables = {

  }

  tags = local.tags
}
