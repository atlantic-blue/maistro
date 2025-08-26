locals {
  tags = {
    product = "${var.product_name}"
    environment = "${var.environment}"
    gitRepo    = "github.com/atlantic-blue/maistro"
  }

  www_lambda_ssr_bucket_name = "${var.product_name}-www-${var.environment}"
  www_lambda_ssr_s3_origin_id    = "s3-${local.www_lambda_ssr_bucket_name}-${var.environment}"


  api_bucket_name     = "${var.product_name}-api-${var.environment}"
  api_domain_name     = "${var.product_name}-api-${var.environment}.${var.domain_name}"
}