resource "aws_route53_record" "users" {
  zone_id = "Z04277421F81SV5P9H2GC"
  name    = "${var.domain_name}"
  type    = "A"
  alias {
    name                   = aws_cognito_user_pool_domain.authz.cloudfront_distribution
    zone_id                = aws_cognito_user_pool_domain.authz.cloudfront_distribution_zone_id
    evaluate_target_health = false
  }
}
