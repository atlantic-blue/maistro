output "www_bucket" {
  value = aws_s3_bucket.www.id
}

output "www_cloudfront_distribution" {
  value = "https://${aws_cloudfront_distribution.www.domain_name}"
}
