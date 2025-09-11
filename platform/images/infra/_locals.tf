locals {
  # maistro-platform-images-api-production.maistro.website
  api_domain_name = "${var.platform_name}-api-${var.environment}.${var.root_domain_name}"
  # maistro-platform-images-api-production
  api_bucket_name = "${var.platform_name}-api-${var.environment}"
  hosting_bucket_name = "${var.platform_name}-hosting-${var.environment}"

  tags = {
    product     = "${var.platform_name}"
    environment = "${var.environment}"
    gitRepo     = "github.com/atlantic-blue/maistro"
  }
}