output "api_gateway_domain_api" {
  value = module.platform_users_api.api_gateway_domain_api
}

output "api_gateway_domain_api_v1" {
  value = module.platform_users_api.api_gateway_domain_api_v1
}

output "api_gateway_url" {
  value = module.platform_users_api.api_gateway_url
}

## Used in congnito's post authentication step
output "aws_lambda_post_authentication_function_arn" {
  value = aws_lambda_function.event_lambda_users_crate.arn
}

output "aws_lambda_post_authentication_function_name" {
  value = aws_lambda_function.event_lambda_users_crate.function_name
}