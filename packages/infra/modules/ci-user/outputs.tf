output "ci_access_key_id" {
  value = aws_iam_access_key.ci_user_key.id
}

# command: terraform output ci_secret_access_key
output "ci_secret_access_key" {
  value     = aws_iam_access_key.ci_user_key.secret
  sensitive = true
}
