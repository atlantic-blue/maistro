resource "aws_cloudfront_public_key" "video_public_key" {
  name        = "${var.platform_name}-cloufront-public-key"
  encoded_key = file("${path.module}/public_key.pem")
  comment     = "Public key for Maistro video signing"
}

resource "aws_cloudfront_key_group" "video_key_group" {
  name    = "${var.platform_name}-cloudfront-key-group"
  items   = [aws_cloudfront_public_key.video_public_key.id]
  comment = "Key group for Maistro video"
}

resource "aws_cloudfront_origin_access_identity" "video" {
  comment = "access_identity_${var.platform_name}.s3.amazonaws.com"
}

resource "aws_cloudfront_distribution" "video" {
  origin {
    domain_name = aws_s3_bucket.video_output.bucket_regional_domain_name
    origin_id   = "s3-${aws_s3_bucket.video_output.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.video.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  comment             = "CDN for ${var.domain_name}"

  default_cache_behavior {
    allowed_methods    = ["GET", "HEAD", "OPTIONS"]
    cached_methods     = ["GET", "HEAD"]
    target_origin_id   = "s3-${aws_s3_bucket.video_output.id}"
    trusted_key_groups = [aws_cloudfront_key_group.video_key_group.id]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = merge(
    local.tags,
    {
      managedBy = "Terraform",
    }
  )

}