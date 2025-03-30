resource "aws_iam_user" "ci_user" {
  name = var.product_name
  path = "/ci/"

  tags = merge(
    var.tags,
    {
      managedBy = "Terraform",
    }
  )
}

resource "aws_iam_access_key" "ci_user_key" {
  user = aws_iam_user.ci_user.name
}

data "aws_iam_policy_document" "ci_s3_access" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject"
    ]

    resources = var.s3_resources
  }
}

resource "aws_iam_user_policy" "ci_s3_access" {
  name = "${var.product_name}-s3-access"
  user = aws_iam_user.ci_user.name

  policy = data.aws_iam_policy_document.ci_s3_access.json
}
