module "products_chat_api" {
  source = "../../../packages/infra/modules/api-gateway"
  
  acm_certificate_arn = var.acm_certificate_arn
  route53_zone_id = var.route53_zone_id
  api_bucket_name = local.api_bucket_name
  api_domain_name = local.api_domain_name

  tags = local.tags
}
