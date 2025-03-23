resource "aws_route53_zone" "www" {
  name = var.domain_name
  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
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

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_route53_record" "www_record" {
  zone_id = aws_route53_zone.www.id
  name    = var.domain_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.www.domain_name
    zone_id                = aws_cloudfront_distribution.www.hosted_zone_id
    evaluate_target_health = false
  }
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
    "google-site-verification=${local.www_google_site_verification_token}"
  ]
}
