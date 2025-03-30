variable "product_name" {
  description = "Name of the product this CI user is associated with"
  type        = string
  default     = "maistro-shared" # Default to shared if not product-specific
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable "s3_resources" {
  description = "List of S3 bucket ARNs that the CI user should have access to"
  type        = list(string)
  default     = []
}
