variable "aws_account" {
  default = "atlantic-blue"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  default = "production"
}

variable "product_name" {
  default = "maistro-bookings"
}

variable "domain_name" {
  default = "maistroapp.com"
}

variable "www_google_site_verification_token" {
  type = string
}

variable "route53_zone_id" {
  type = string
}

variable "acm_certificate_arn" {
  type = string
}