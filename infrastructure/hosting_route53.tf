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
