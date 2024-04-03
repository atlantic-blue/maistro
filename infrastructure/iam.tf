resource "aws_iam_user" "website_builder" {
  name = "website_builder"

  tags = {
    application = "${lookup(local.tags, "application")}"
    environment = "${lookup(local.tags, "environment")}"
    gitRepo     = "${lookup(local.tags, "git_repo")}"
    managedBy   = "${lookup(local.tags, "managed_by")}"
  }
}

resource "aws_iam_user_policy" "website_builder" {
  name   = aws_iam_user.website_builder.name
  user   = aws_iam_user.website_builder.name
  policy = data.aws_iam_policy_document.website_builder.json
}

data "aws_iam_policy_document" "website_builder" {
  statement {
    actions = [
      "s3:*",
    ]

    resources = [
      "${aws_s3_bucket.www.arn}",
      "${aws_s3_bucket.www.arn}/*"
    ]
  }
}

resource "aws_iam_access_key" "website_builder" {
  user = aws_iam_user.website_builder.name
}

output "website_builder_access_key_id" {
  value = aws_iam_access_key.website_builder.id
}

# terraform output website_builder_secret_access_key
output "website_builder_secret_access_key" {
  value     = aws_iam_access_key.website_builder.secret
  sensitive = true
}
