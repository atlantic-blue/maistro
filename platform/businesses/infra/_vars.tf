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
  default = "maistro-platform-businesses"
}

variable "root_domain_name" {
  default = "maistroapp.com"
}

variable "domain_name" {
  default = "businesses.maistroapp.com"
}

variable "acm_certificate_arn" {
  type = string
}

variable "route53_zone_id" {
  type = string
}