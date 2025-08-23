data "aws_iam_policy_document" "www_lambda_ssr_bucket" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.www_lambda_ssr.arn}/*"
    ]
    principals {
      type = "AWS"
      identifiers = [
        "${aws_cloudfront_origin_access_identity.www_lambda_ssr.iam_arn}"
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "www_lambda_ssr" {
  bucket = aws_s3_bucket.www_lambda_ssr.id
  policy = data.aws_iam_policy_document.www_lambda_ssr_bucket.json
}

resource "aws_s3_bucket_ownership_controls" "www_lambda_ssr" {
  bucket = aws_s3_bucket.www_lambda_ssr.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "www_lambda_ssr" {
  depends_on = [aws_s3_bucket_ownership_controls.www_lambda_ssr]

  bucket = aws_s3_bucket.www_lambda_ssr.id
  acl    = "private"
}

resource "aws_s3_bucket" "www_lambda_ssr" {
  bucket = local.www_lambda_ssr_bucket_name
  tags = local.tags
}

output "www_lambda_ssr_bucket" {
  value = aws_s3_bucket.www_lambda_ssr.id
}
