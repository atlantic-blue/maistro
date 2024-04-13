resource "aws_cognito_user_pool" "users" {
  name                     = local.authz_pool_name
  auto_verified_attributes = ["email"]

}

/**
Create a developer account with Google.

1.Create a project within your Google developer account.

2. Add https://<your user pool domain> to your project as an authorized JavaScript origin.

3. Create OAuth 2.0 credentials for a web application.

4. Add https://<your user pool domain>/oauth2/idpresponse to your project as an authorized redirect URI.

5. Add the OAuth client ID and client secret for your Google project to your user pool IDP configuration.
**/
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.users.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes              = "profile email openid"
    client_id                     = local.authz_google_client_id
    client_secret                 = local.authz_google_client_secret
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
    token_request_method          = "POST"
    oidc_issuer                   = "https://accounts.google.com"
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = "true"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
    name     = "name"
    picture  = "picture"
  }
}

resource "aws_cognito_user_pool_client" "cognito" {
  name         = "client"
  user_pool_id = aws_cognito_user_pool.users.id

  supported_identity_providers         = ["Google"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
  ]

  // https://stackoverflow.com/a/50276761
  callback_urls = [
    "http://localhost:3000/callback/",
    "https://${var.domain_name}/callback/"
  ]
  logout_urls = [
    "http://localhost:3000/logout/",
    "https://${var.domain_name}/logout/"
  ]

  read_attributes     = []
  write_attributes    = []
  explicit_auth_flows = []
  generate_secret     = true
}

resource "aws_cognito_user_pool_domain" "users" {
  user_pool_id    = aws_cognito_user_pool.users.id
  domain          = "authz.${var.domain_name}"
  certificate_arn = aws_acm_certificate.www_certificate.arn
}

resource "aws_cognito_user_pool_ui_customization" "example" {
  client_id = aws_cognito_user_pool_client.cognito.id

  css        = file("${path.module}/../packages/client/assets/authz.css")
  image_file = filebase64("${path.module}/../packages/client/assets/favicon.png")

  user_pool_id = aws_cognito_user_pool_domain.users.user_pool_id
}

output "cognito_login_url_example" {
  value = "https://${aws_cognito_user_pool_domain.users.domain}/login?response_type=code&client_id=${aws_cognito_user_pool_client.cognito.id}&redirect_uri=https://${var.domain_name}/callback"
}

output "cognito_client_secret" {
  sensitive = true
  value     = aws_cognito_user_pool_client.cognito.client_secret
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.cognito.id
}
