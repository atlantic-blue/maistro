terraform {
  required_version = ">= v1.5.7"

  backend "s3" {
    bucket  = "abs-terraform"
    key     = "maistro-academy"
    region  = "us-east-1"
    profile = "atlantic-blue"
    encrypt = true
  }
}
