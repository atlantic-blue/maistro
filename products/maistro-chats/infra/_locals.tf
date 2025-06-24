locals {
  # maistro-chat-api-production.maistro.website
  api_domain_name = "${var.product_name}-api-${var.environment}.${var.root_domain_name}"
  # maistro-chat-api-production
  api_bucket_name = "${var.product_name}-api-${var.environment}"
  tags = {
    product = "${var.product_name}"
    environment = "${var.environment}"
    gitRepo    = "github.com/atlantic-blue/maistro"
  }
}