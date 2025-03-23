resource "aws_route53_zone" "email" {
  name = var.domain_name_email
  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_route53_record" "email" {
  zone_id = aws_route53_zone.www.zone_id
  name    = var.domain_name_email
  type    = "NS"
  ttl     = 300

  records = aws_route53_zone.email.name_servers
}
