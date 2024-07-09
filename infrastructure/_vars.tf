variable "aws_account" {
  default = "atlantic-blue"
}

variable "project_name" {
  default = "maistro"
}

variable "domain_name" {
  default = "maistro.website"
}

variable "domain_name_hosting" {
  default = "maistro.live"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  default = "production"
}

variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type = string
}

variable "google_site_verification_token" {
  type = string
}

variable "payments_secret_key" {
  type = string
}

variable "payments_webhook_secret_key" {
  type = string
}

variable "images_acces_key" {
  type = string
}
