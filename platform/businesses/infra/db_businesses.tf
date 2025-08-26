resource "aws_dynamodb_table" "maistro_businesses" {
  name           = "${var.platform_name}-${var.environment}-businesses"
  billing_mode   = "PROVISIONED"
  hash_key       = "BusinessId"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "BusinessId"
    type = "S"
  }

  attribute {
    name = "Slug"
    type = "S"
  }
  attribute {
    name = "UserId"
    type = "S"
  }

  global_secondary_index {
    name            = "BusinessId-index"
    hash_key        = "BusinessId"
    projection_type = "ALL"

    read_capacity   = 1
    write_capacity  = 1
  }

  global_secondary_index {
    name            = "Slug-index"
    hash_key        = "Slug"
    projection_type = "ALL"

    read_capacity   = 1
    write_capacity  = 1
  }

  # Global Secondary Index for querying by Cognito User ID
  global_secondary_index {
    name            = "UserId-index"
    hash_key        = "UserId"
    projection_type = "ALL"

    read_capacity   = 1
    write_capacity  = 1
  }

  tags = local.tags
}
