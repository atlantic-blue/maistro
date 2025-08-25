output "aws_route53_zone_www_zone_id" {
    value = aws_route53_zone.www.zone_id
}

output "aws_acm_arn" {
    value = aws_acm_certificate.www_certificate.arn
}
