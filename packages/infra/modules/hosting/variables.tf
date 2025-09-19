variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "domain_name" {
    description = "The sub domain"
    type = string
}

variable "zone_id" {
    description = "The Zone id for maistro.website"
    type = string
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable default_cache {
  type = map(string)
  default = {
    min_ttl = 0
    default_ttl = 0
    max_ttl = 0
  }
}
