locals {
  tags = {
    platform    = "${var.platform_name}"
    environment = "${var.environment}"
    gitRepo     = "github.com/atlantic-blue/maistro"
  }

  source_dir_path = "${path.module}/../backend/dist/video-processor"
  output_path = "${path.module}/dist/video_processor.zip"
}

