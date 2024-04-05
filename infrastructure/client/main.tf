terraform {
  required_version = ">= v1.3.1"

  backend "s3" {
    bucket  = "abs-terraform"
    key     = "website-builder"
    region  = "us-east-1"
    encrypt = true
    profile = "atlantic-blue"
  }
}
