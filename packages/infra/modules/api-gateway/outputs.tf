output "api_gateway_domain_api" {
  value = "https://${aws_apigatewayv2_api_mapping.api.domain_name}"
}

output "api_gateway_domain_api_v1" {
  value = "https://${aws_apigatewayv2_api_mapping.api_v1.domain_name}/${aws_apigatewayv2_api_mapping.api_v1.api_mapping_key}"
}
output "api_gateway_url" {
  description = "Base URL for API Gateway stage."
  value       = aws_apigatewayv2_stage.prod.invoke_url
}

output "apigateway" {
  value = aws_apigatewayv2_api.api
}

output api_bucket {
  value =  aws_s3_bucket.api
}
