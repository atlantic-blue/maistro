locals {
  tags = {
    application = "${var.project_name}"
    environment = "${var.environment}"
    git_repo    = "github.com/atlantic-blue/${local.project_name}"
    managed_by  = "Terrafrom"
  }

  enviroment_delimiter = var.environment == "production" ? "" : "-${var.environment}"

  project_name = var.project_name

  // ab = Atlantic Blue
  www_bucket_name          = "ab-website-builder" // TODO should be "ab-${var.project_name}-builder"
  www_cloudfront_origin_id = "s3-${local.www_bucket_name}${local.enviroment_delimiter}"
  www_domain_name          = "www.${var.domain_name}"

  hosting_bucket_name          = "ab-${var.project_name}-hosting"
  hosting_cloudfront_origin_id = "s3-${local.hosting_bucket_name}${local.enviroment_delimiter}"
  hosting_domain_name          = "hosting.${var.domain_name}"

  api_bucket_name = "ab-${var.project_name}-api"
  api_domain_name = "api.${var.domain_name}"

  authz_pool_name = "ab-${var.project_name}"
  authz_google_client_id = var.google_client_id
  authz_google_client_secret = var.google_client_secret
}
