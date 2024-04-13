resource "aws_route53_record" "users" {
  zone_id = aws_route53_zone.www.id
  name    = "authz.${var.domain_name}"
  type    = "A"
  alias {
    name                   = aws_cognito_user_pool_domain.users.cloudfront_distribution
    zone_id                = aws_cognito_user_pool_domain.users.cloudfront_distribution_zone_id
    evaluate_target_health = false
  }
}
