module "ci_user" {
  source = "../../../packages/infra/modules/ci-user"

  product_name = var.product_name

  s3_resources = [
    "arn:aws:s3:::${var.product_name}-hosting-${var.environment}",
    "arn:aws:s3:::${var.product_name}-hosting-${var.environment}/*"
  ]

  tags = local.tags
}
