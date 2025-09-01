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
    default = "maistro-customers"
}

variable "domain_name" {
  default = "customer.maistroapp.com"
}

variable "route53_zone_id" {
  type = string
}
