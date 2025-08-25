locals {
  # maistro-platform-businesses-api-production.maistroapp.com
  api_domain_name = "${var.platform_name}-api-${var.environment}.${var.root_domain_name}"
  # maistro-platform-businesses-api-production
  api_bucket_name = "${var.platform_name}-api-${var.environment}"
  tags = {
    product     = "${var.platform_name}"
    environment = "${var.environment}"
    gitRepo     = "github.com/atlantic-blue/maistro"
  }
}