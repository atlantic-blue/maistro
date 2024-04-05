data "aws_iam_policy_document" "hosting" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.hosting.arn}/*"
    ]
    principals {
      type = "AWS"
      identifiers = [
        "${aws_cloudfront_origin_access_identity.hosting.iam_arn}"
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "hosting" {
  bucket = aws_s3_bucket.hosting.id
  policy = data.aws_iam_policy_document.hosting.json
}

resource "aws_s3_bucket_ownership_controls" "hosting" {
  bucket = aws_s3_bucket.hosting.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "hosting" {
  depends_on = [aws_s3_bucket_ownership_controls.hosting]

  bucket = aws_s3_bucket.hosting.id
  acl    = "private"
}

resource "aws_s3_bucket" "hosting" {
  bucket = local.hosting_bucket_name
  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

output "hosting_bucket" {
  value = aws_s3_bucket.hosting.id
}
