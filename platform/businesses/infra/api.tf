module "platform_businesses_api" {
  source = "../../../packages/infra/modules/api-gateway"

  product_name        = var.platform_name
  acm_certificate_arn = var.acm_certificate_arn
  route53_zone_id     = var.route53_zone_id
  api_bucket_name     = local.api_bucket_name
  api_domain_name     = local.api_domain_name

  tags = local.tags
}
