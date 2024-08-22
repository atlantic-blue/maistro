resource "aws_cognito_user_group" "authz_cognito_group_role_system" {
  name = "${local.authz_pool_name}-user-group-system"

  user_pool_id = aws_cognito_user_pool.authz.id
  description  = "System Group Managed by Terraform"
}
