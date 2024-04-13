variable "aws_account" {
  default = "atlantic-blue"
}

variable "project_name" {
  default = "maistro"
}

variable "domain_name" {
  default = "maistro.website"
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
