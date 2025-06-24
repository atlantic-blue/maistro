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
    default = "maistro-chat"
}

variable "root_domain_name" {
  default = "maistro.website"
}

variable "domain_name" {
  default = "chat.maistro.website"
}

variable "acm_certificate_arn" {
  default = "arn:aws:acm:us-east-1:230345688874:certificate/aea3d759-73cb-433d-9798-9477d81eb42e"
}

variable "route53_zone_id" {
  default = "Z04277421F81SV5P9H2GC"
}