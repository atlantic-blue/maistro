resource "aws_acm_certificate" "hosting_certificate" {
  domain_name       = var.domain_name_hosting
  validation_method = "DNS"

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }

  lifecycle {
    create_before_destroy = true
  }

  subject_alternative_names = [
    "*.${var.domain_name_hosting}",
  ]
}

resource "aws_route53_record" "hosting_cert_dns" {
  allow_overwrite = true
  zone_id         = aws_route53_zone.hosting.zone_id
  name            = tolist(aws_acm_certificate.hosting_certificate.domain_validation_options)[0].resource_record_name
  ttl             = 60

  records = [tolist(aws_acm_certificate.hosting_certificate.domain_validation_options)[0].resource_record_value]
  type    = tolist(aws_acm_certificate.hosting_certificate.domain_validation_options)[0].resource_record_type

}

resource "aws_acm_certificate_validation" "hosting_cert_validate" {
  certificate_arn         = aws_acm_certificate.hosting_certificate.arn
  validation_record_fqdns = [aws_route53_record.hosting_cert_dns.fqdn]
}
