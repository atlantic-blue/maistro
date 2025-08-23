output "ci_access_key_id" {
    value = module.ci_user.ci_access_key_id
}

output "ci_secret_access_key" {
  value     = module.ci_user.ci_secret_access_key
  sensitive = true
}
