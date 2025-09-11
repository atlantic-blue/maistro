output "api_gateway_domain_api" {
  value = module.platform_api.api_gateway_domain_api
}

output "api_gateway_domain_api_v1" {
  value = module.platform_api.api_gateway_domain_api_v1
}

output "api_gateway_url" {
  value = module.platform_api.api_gateway_url
}

output "hosting_domain_url" {
  value = "https://${var.domain_name}/"
}