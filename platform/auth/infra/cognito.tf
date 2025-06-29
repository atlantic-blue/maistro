resource "aws_cognito_user_pool" "authz" {
  name                     = local.authz_pool_name
  auto_verified_attributes = ["email"]

  lambda_config {
    post_authentication = var.aws_lambda_post_authentication_function_arn
  }
}

resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.aws_lambda_post_authentication_function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.authz.arn
}

/**
Create a developer account with Google.

1.Create a project within your Google developer account.

2. Add https://<your user pool domain> to your project as an authorized JavaScript origin.

3. Create OAuth 2.0 credentials for a web application.

4. Add https://<your user pool domain>/oauth2/idpresponse to your project as an authorized redirect URI.

5. Add the OAuth client ID and client secret for your Google project to your user pool IDP configuration.
**/
resource "aws_cognito_identity_provider" "authz_google" {
  user_pool_id  = aws_cognito_user_pool.authz.id
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

resource "aws_cognito_user_pool_client" "authz" {
  name         = local.authz_pool_name
  user_pool_id = aws_cognito_user_pool.authz.id

  supported_identity_providers         = ["Google"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
  ]

  // https://stackoverflow.com/a/50276761
  callback_urls = var.callback_urls
  logout_urls = var.logout_urls

  read_attributes     = []
  write_attributes    = []
  explicit_auth_flows = []
  generate_secret     = true
}

resource "aws_cognito_user_pool_domain" "authz" {
  user_pool_id    = aws_cognito_user_pool.authz.id
  domain          = "${var.domain_name}"
  certificate_arn = "${var.pool_domain_certificate_arn}"
}

resource "aws_cognito_user_pool_ui_customization" "cognito" {
  client_id = aws_cognito_user_pool_client.authz.id

  css        = file("${path.module}/../frontend/public/authz.css")
  image_file = filebase64("${path.module}/../frontend/public/favicon.png")

  user_pool_id = aws_cognito_user_pool_domain.authz.user_pool_id
}
