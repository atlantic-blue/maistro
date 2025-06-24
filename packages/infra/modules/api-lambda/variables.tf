variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

variable "lambda_name" {
  type = string
}

variable "input_dir" {
  type = string
}

variable "output_path" {
  type = string
}

variable "lambda_env_variables" {
  type        = map(string)
}

variable "route_keys" {
  type = list(string)
  description = "List of route keys to create"
  # [GET /hello-world, POST /hello-world]
}

variable "apigateway_id" {
    type = string
}

variable "apigateway_execution_arn" {
  type = string
}

variable "apigateway_bucket_id" {
  type = string
}