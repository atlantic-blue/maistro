resource "aws_cloudfront_origin_access_identity" "www" {
  comment = "access_identity_${local.www_bucket_name}.s3.amazonaws.com"
}

resource "aws_cloudfront_distribution" "wwww" {
  origin {
    domain_name = aws_s3_bucket.www.bucket_regional_domain_name
    origin_id   = local.www_cloudfront_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.www.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "www maistro CDN"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.www_cloudfront_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
    compress    = true
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  aliases = [
    var.domain_name,
    local.www_domain_name,
  ]

  viewer_certificate {
    # cloudfront_default_certificate = true
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
    acm_certificate_arn      = aws_acm_certificate.www_certificate.arn
  }
}


output "hosting_aws_cloudfront_distribution" {
  value = "https://${aws_cloudfront_distribution.hosting.domain_name}"
}