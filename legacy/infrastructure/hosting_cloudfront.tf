resource "aws_cloudfront_origin_access_identity" "hosting" {
  comment = "access_identity_${local.hosting_bucket_name}.s3.amazonaws.com"
}

resource "aws_cloudfront_distribution" "hosting" {
  origin {
    domain_name = aws_s3_bucket.hosting.bucket_regional_domain_name
    origin_id   = local.hosting_cloudfront_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.hosting.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "hosting maistro CDN"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.hosting_cloudfront_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type   = "viewer-request"
      include_body = false
      lambda_arn   = aws_lambda_function.hosting_redirect.qualified_arn
    }

    viewer_protocol_policy = "redirect-to-https"

    // TODO set sensible defaults
    min_ttl     = 60 // 1minute
    default_ttl = 60 // 1minute
    max_ttl     = 60 // 1minute
    compress    = true
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html" // TODO create error page
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/404.html" // TODO style 404 page
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
    "${var.domain_name_hosting}",
    "*.${var.domain_name_hosting}",
  ]

  viewer_certificate {
    # cloudfront_default_certificate = true
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
    acm_certificate_arn      = aws_acm_certificate.hosting_certificate.arn
  }
}


output "hosting_cloudfront_distribution" {
  value = "https://${aws_cloudfront_distribution.hosting.domain_name}"
}
