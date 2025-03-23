# S3 BUCKET
resource "aws_s3_bucket" "api" {
  bucket        = local.api_bucket_name
  force_destroy = true

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_s3_bucket_public_access_block" "api" {
  bucket = aws_s3_bucket.api.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
