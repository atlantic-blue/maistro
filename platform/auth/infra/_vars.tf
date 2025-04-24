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
    default = "maistro-platform-auth"
}

variable "domain_name" {
  default = "auth.maistro.website"
}

variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type = string
}

variable "callback_urls" {
  type = set(string)
  default = [
    "http://localhost:3000/callback/",
    "https://maistro.website/callback/",
    "https://academy.maistro.website/callback/",
    "https://customers.maistro.website/callback/",
    "https://funnels.maistro.website/callback/",
    "https://socials.maistro.website/callback/",
    "https://v2.website/callback/",
  ]
}

variable "logout_urls" {
  type = set(string)
  default = [
    "http://localhost:3000/logout/",
    "https://maistro.website/logout/",
    "https://academy.maistro.website/logout/",
    "https://customers.maistro.website/logout/",
    "https://funnels.maistro.website/logout/",
    "https://socials.maistro.website/logout/",
    "https://v2.website/logout/",
  ]
}

variable "pool_domain_certificate_arn" {
  type = string
  default = "arn:aws:acm:us-east-1:230345688874:certificate/aea3d759-73cb-433d-9798-9477d81eb42e"
}