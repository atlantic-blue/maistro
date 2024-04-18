/**
    Subdomain: Hosting
**/
resource "aws_route53_zone" "hosting" {
  name = "hosting.${var.domain_name}"
  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_route53_record" "hosting_record_ns" {
  zone_id = aws_route53_zone.www.id
  name    = "hosting.${var.domain_name}"
  type    = "NS"
  ttl     = 172800

  records = toset(aws_route53_zone.hosting.name_servers)
}

resource "aws_route53_record" "hosting" {
  zone_id = aws_route53_zone.hosting.id
  name    = "hosting.${var.domain_name}"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.hosting.domain_name
    zone_id                = aws_cloudfront_distribution.hosting.hosted_zone_id
    evaluate_target_health = false
  }
}

/**
    Custom routes
**/
resource "aws_route53_record" "hosting_blog" {
  zone_id = aws_route53_zone.hosting.id
  name    = "*.hosting.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.hosting.domain_name
    zone_id                = aws_cloudfront_distribution.hosting.hosted_zone_id
    evaluate_target_health = false
  }
}
