module "hosting" {
  source = "../../../packages/infra/modules/hosting"
  
  bucket_name          = "${var.product_name}-hosting-${var.environment}"
  domain_name = "${var.domain_name}"
  zone_id = "${aws_route53_zone.www.zone_id}"

  tags = merge(
    "${local.tags}",
    {
      Product     = "${var.product_name}"
      Environment = var.environment
    }
  )
}

resource "aws_route53_zone" "www" {
  name = var.domain_name
  tags = local.tags
}

# see https://github.com/hashicorp/terraform-provider-aws/issues/27318
resource "aws_route53domains_registered_domain" "www" {
  domain_name = var.domain_name

  dynamic "name_server" {
    for_each = toset(aws_route53_zone.www.name_servers)
    content {
      name = name_server.value
    }
  }

  tags = local.tags
}

/*
https://search.google.com/search-console/welcome?utm_source=about-page
*/
resource "aws_route53_record" "www_record_txt_google_verify" {
  zone_id = aws_route53_zone.www.id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 300
  records = [
    "google-site-verification=${var.www_google_site_verification_token}"
  ]
}
