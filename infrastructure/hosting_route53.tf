resource "aws_route53_zone" "hosting" {
  name = var.domain_name_hosting
  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

# see https://github.com/hashicorp/terraform-provider-aws/issues/27318
resource "aws_route53domains_registered_domain" "hosting" {
  domain_name = var.domain_name_hosting

  dynamic "name_server" {
    for_each = toset(aws_route53_zone.hosting.name_servers)
    content {
      name = name_server.value
    }
  }

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_route53_record" "hosting" {
  zone_id = aws_route53_zone.hosting.id
  name    = var.domain_name_hosting
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.hosting.domain_name
    zone_id                = aws_cloudfront_distribution.hosting.hosted_zone_id
    evaluate_target_health = false
  }
}

/**
    Custom routes
**/
resource "aws_route53_record" "hosting_blog" {
  zone_id = aws_route53_zone.hosting.id
  name    = "*.${var.domain_name_hosting}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.hosting.domain_name
    zone_id                = aws_cloudfront_distribution.hosting.hosted_zone_id
    evaluate_target_health = false
  }
}
