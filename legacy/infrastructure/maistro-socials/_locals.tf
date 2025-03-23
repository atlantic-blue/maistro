locals {
  tags = {
    application = "${var.project_name}"
    environment = "${var.environment}"
    git_repo    = "github.com/atlantic-blue/${local.project_name}"
    managed_by  = "Terrafrom"
  }

  enviroment_delimiter = var.environment == "production" ? "" : "-${var.environment}"

  project_name = var.project_name

  prefix                             = "atlantic-blue"
  www_bucket_name                    = "${local.prefix}-${var.project_name}-www"
  www_cloudfront_origin_id           = "s3-${local.www_bucket_name}${local.enviroment_delimiter}"
}
