#
# Apend the redirect URL from the FE
# &redirect_uri=https://funnels.maistro.website/callback
#
output "authz_login_url" {
  value = "https://${aws_cognito_user_pool_domain.authz.domain}/login?response_type=code&client_id=${aws_cognito_user_pool_client.authz.id}"
}

output "authz_client_secret" {
  sensitive = true
  value     = aws_cognito_user_pool_client.authz.client_secret
}

output "authz_client_id" {
  value = aws_cognito_user_pool_client.authz.id
}
