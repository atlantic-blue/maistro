variable "domain_name" {
    description = "Top level domain name"
    type = string
    default = "maistro.website"
}

variable "product_name" {
  description = "Name of the product this api is associated with"
  type        = string
  default     = "maistro-shared" # Default to shared if not product-specific
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable "route53_zone_id" {
  description = "zone ID of the Api"
  type = string
}

variable "api_domain_name" {
  description = "api domain name"
  type = string
}

variable "acm_certificate_arn" {
  description = "acm certificate arn"
  type = string
}

variable "api_bucket_name" {
  description = "bucket to upload lambdas to"
  type = string
}