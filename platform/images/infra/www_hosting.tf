module "hosting" {
  source = "../../../packages/infra/modules/hosting"
  
  bucket_name          = "${local.hosting_bucket_name}"
  domain_name =       "${var.domain_name}"
  zone_id = "${var.route53_zone_id}"

  tags = merge(
    "${local.tags}",
    {
      Product     = "${var.platform_name}"
      Environment = var.environment
    }
  )
}
