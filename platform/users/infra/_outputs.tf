output "api_gateway_domain_api" {
  value = module.platform_users_api.api_gateway_domain_api
}

output "api_gateway_domain_api_v1" {
  value = module.platform_users_api.api_gateway_domain_api_v1
}

output "api_gateway_url" {
  value       = module.platform_users_api.api_gateway_url
}
