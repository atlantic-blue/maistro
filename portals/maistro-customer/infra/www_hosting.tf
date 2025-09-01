module "hosting" {
  source = "../../../packages/infra/modules/hosting"
  
  bucket_name          = "${var.product_name}-hosting-${var.environment}"
  domain_name = "${var.domain_name}"
  zone_id = "${var.route53_zone_id}"
  
  tags = local.tags
}
