locals {
  tags = {
    platform = "${var.platform_name}"
    environment = "${var.environment}"
    gitRepo    = "github.com/atlantic-blue/maistro"
  }

    authz_pool_name            = "${var.platform_name}-${var.environment}"
    authz_google_client_id     = var.google_client_id
    authz_google_client_secret = var.google_client_secret
}