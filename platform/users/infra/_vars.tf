variable "aws_account" {
  default = "atlantic-blue"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  default = "production"
}

variable "platform_name" {
  default = "maistro-platform-users"
}

variable "root_domain_name" {
  default = "maistro.website"
}

variable "domain_name" {
  default = "users.maistro.website"
}

variable "acm_certificate_arn" {
  type = string
}

variable "route53_zone_id" {
  type = string
}