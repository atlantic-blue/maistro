module "hosting" {
  source = "../../../packages/infra/modules/hosting"
  
  bucket_name          = "${var.product_name}-hosting-${var.environment}"
  domain_name = "${var.domain_name}"
  zone_id = "Z04277421F81SV5P9H2GC"

  tags = local.tags
}
