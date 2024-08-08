# SES domain
resource "aws_ses_domain_identity" "domain_identity" {
  domain = var.domain_name_email
}

resource "aws_route53_record" "ses_verification" {
  zone_id = aws_route53_zone.email.id
  name    = "_amazonses.${var.domain_name_email}"
  type    = "TXT"
  records = [aws_ses_domain_identity.domain_identity.verification_token]
  ttl     = "600"
}

# DKIM
# https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim.html
resource "aws_ses_domain_dkim" "email" {
  domain = aws_ses_domain_identity.domain_identity.domain
}

resource "aws_route53_record" "email_dkim_records" {
  count   = 3
  zone_id = aws_route53_zone.email.id
  name    = "${element(aws_ses_domain_dkim.email.dkim_tokens, count.index)}._domainkey.${var.domain_name_email}"
  type    = "CNAME"
  ttl     = "600"

  records = [
    "${element(aws_ses_domain_dkim.email.dkim_tokens, count.index)}.dkim.amazonses.com",
  ]
}

# SES mail to records
# see https://docs.aws.amazon.com/ses/latest/dg/receiving-email-mx-record.html
resource "aws_route53_record" "email-mx-records" {
  zone_id = aws_route53_zone.email.id
  name    = var.domain_name_email
  type    = "MX"
  ttl     = "600"

  records = [
    "10 inbound-smtp.us-east-1.amazonses.com",
    "10 inbound-smtp.us-east-1.amazonaws.com",
  ]
}

## https://www.cloudflare.com/en-gb/learning/dns/dns-records/dns-spf-record/
resource "aws_route53_record" "ms-spf-records" {
  zone_id = aws_route53_zone.email.id
  name    = var.domain_name_email
  type    = "TXT"
  ttl     = "600"

  records = [
    "v=spf1 include:amazonses.com -all",
  ]
}
