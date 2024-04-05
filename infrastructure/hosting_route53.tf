resource "aws_route53_zone" "hosting" {
  name = var.domain_name
  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_route53_record" "hosting" {
  zone_id = aws_route53_zone.www.id
  name    = "hosting.${var.domain_name}"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.hosting.domain_name
    zone_id                = aws_cloudfront_distribution.hosting.hosted_zone_id
    evaluate_target_health = false
  }
}
