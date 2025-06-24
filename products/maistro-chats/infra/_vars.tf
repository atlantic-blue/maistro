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
    default = "maistro-chats"
}

variable "root_domain_name" {
  default = "maistro.website"
}

variable "domain_name" {
  default = "chats.maistro.website"
}

variable "acm_certificate_arn" {
  default = "arn:aws:acm:us-east-1:230345688874:certificate/aea3d759-73cb-433d-9798-9477d81eb42e"
}

variable "route53_zone_id" {
  default = "Z04277421F81SV5P9H2GC"
}

variable "meta_webhook_verify_token" {
  type  = string
}

variable "meta_webhook_fb_app_id" {
  type = string
}

variable "meta_webhook_fb_app_secret" {
  type = string
}