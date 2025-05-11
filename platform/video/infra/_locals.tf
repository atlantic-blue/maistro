locals {
  tags = {
    platform    = "${var.platform_name}"
    environment = "${var.environment}"
    gitRepo     = "github.com/atlantic-blue/maistro"
    managed_by = "Terraform"
  }

  source_dir_path = "${path.module}/../backend/dist/video-processor"
  output_path = "${path.module}/dist/video_processor.zip"

  api_domain_name = "video-platform.${var.domain_name}"
}

