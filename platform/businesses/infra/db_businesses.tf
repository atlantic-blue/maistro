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
    name = "UserId"
    type = "S"
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
