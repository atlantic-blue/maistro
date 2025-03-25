output "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the website"
  value       = module.hosting.www_bucket
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.hosting.www_cloudfront_distribution
}
