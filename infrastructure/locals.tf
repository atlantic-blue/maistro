locals {
  tags = {
    application = "maistro"
    environment = "${var.environment}"
    git_repo    = "github.com/atlantic-blue/${local.project_repo}"
    managed_by  = "Terrafrom"
  }

  enviroment_delimiter = var.environment == "production" ? "" : "-${var.environment}"

  project_repo = "maistro"

  www_bucket_name          = "ab-website-builder"
  www_cloudfront_origin_id = "s3-${local.www_bucket_name}${local.enviroment_delimiter}"
  www_domain_name          = "www.${var.domain_name}"

  hosting_bucket_name          = "ab-maistro-hosting"
  hosting_cloudfront_origin_id = "s3-${local.hosting_bucket_name}${local.enviroment_delimiter}"
  hosting_domain_name          = "hosting.${var.domain_name}"
}
