resource "aws_cloudfront_origin_access_identity" "www_lambda_ssr" {
  comment = "access_identity_${local.www_lambda_ssr_bucket_name}"
}


resource "aws_cloudfront_distribution" "www_lambda_ssr" {
  # Point to S3 BUCKET
  origin {
    domain_name = aws_s3_bucket.www_lambda_ssr.bucket_regional_domain_name
    origin_id   = local.www_lambda_ssr_s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.www_lambda_ssr.cloudfront_access_identity_path
    }
  }

  origin {
    # This is required because "domain_name" needs to be in a specific format
    domain_name = replace(replace(aws_lambda_function_url.www_lambda_ssr.function_url, "https://", ""), "/", "")
    origin_id   = aws_lambda_function.www_lambda_ssr.function_name

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_lambda_function.www_lambda_ssr.function_name

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 60 * 1
    default_ttl            = 60 * 2
    max_ttl                = 60 * 5
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "/public/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.www_lambda_ssr_s3_origin_id
    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 60 * 10
    default_ttl            = 60 * 10
    max_ttl                = 60 * 10
    compress               = true
  }

  custom_error_response {
    error_code         = "404"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = "403"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "www_lambda_ssr CDN"
  default_root_object = "index.html"

  tags = local.tags

    aliases = [
      var.domain_name
    ]

  viewer_certificate {
    # cloudfront_default_certificate = true
    cloudfront_default_certificate = false
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.1_2016"
    acm_certificate_arn            = var.acm_certificate_arn
  }
}

output "aws_cloudfront_distribution_www_lambda_ssr" {
  value = "https://${aws_cloudfront_distribution.www_lambda_ssr.domain_name}"
}
