data "aws_iam_policy_document" "www" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.www.arn}/*"
    ]
    principals {
      type = "AWS"
      identifiers = [
        "${aws_cloudfront_origin_access_identity.www.iam_arn}"
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "www" {
  bucket = aws_s3_bucket.www.id
  policy = data.aws_iam_policy_document.www.json
}

resource "aws_s3_bucket_ownership_controls" "www" {
  bucket = aws_s3_bucket.www.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "www" {
  depends_on = [aws_s3_bucket_ownership_controls.www]

  bucket = aws_s3_bucket.www.id
  acl    = "private"
}

resource "aws_s3_bucket" "www" {
  bucket = var.bucket_name

  tags = merge(
    var.tags,
    {
        managedBy = "Terraform",
    }
  )
}
