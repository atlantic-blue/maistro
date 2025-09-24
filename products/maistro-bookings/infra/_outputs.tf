output "ci_access_key_id" {
  value = module.ci_user.ci_access_key_id
}

output "ci_secret_access_key" {
  value     = module.ci_user.ci_secret_access_key
  sensitive = true
}

output "api_gateway_domain_api" {
  value = module.product_bookings_api.api_gateway_domain_api
}

output "api_gateway_domain_api_v1" {
  value = module.product_bookings_api.api_gateway_domain_api_v1
}

output "api_gateway_url" {
  value = module.product_bookings_api.api_gateway_url
}
