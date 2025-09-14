module "hosting" {
  source = "../../../packages/infra/modules/hosting"
  
  bucket_name          = "${local.hosting_bucket_name}"
  domain_name =       "${var.domain_name}"
  zone_id = "${var.route53_zone_id}"

  tags = merge(
    "${local.tags}",
    {
      Product     = "${var.platform_name}"
      Environment = var.environment
    }
  )
}


resource "aws_s3_bucket_cors_configuration" "images_cors" {
  bucket = module.hosting.www_bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["POST"]
    allowed_origins = [
      "http://localhost:3000",
      "https://customer.maistroapp.com",
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_iam_role_policy" "api_lambda_s3_upload" {
  name = "${local.hosting_bucket_name}-s3-upload"
  role = module.platform_lambda_images.aws_iam_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:DeleteObject",
          "s3:GetObject",
        ],
        Resource = [
          "arn:aws:s3:::${local.hosting_bucket_name}/users/*",
          "arn:aws:s3:::${local.hosting_bucket_name}/businesses/*"
        ]
      }
    ]
  })
}