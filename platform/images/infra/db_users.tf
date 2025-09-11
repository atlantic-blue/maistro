resource "aws_dynamodb_table" "maistro_images" {
  name           = "${var.platform_name}-${var.environment}-images"
  billing_mode   = "PROVISIONED"
  hash_key       = "ImageId"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "ImageId"
    type = "S"
  }

  attribute {
    name = "OwnerId"
    type = "S"
  }

  # Global Secondary Index for querying by Cognito User ID
  global_secondary_index {
    name            = "ImageId-index"
    hash_key        = "ImageId"
    projection_type = "ALL"

    read_capacity   = 1
    write_capacity  = 1
  }

  # Global Secondary Index for querying by Cognito User ID
  global_secondary_index {
    name            = "OwnerId-index"
    hash_key        = "OwnerId"
    projection_type = "ALL"

    read_capacity   = 1
    write_capacity  = 1
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "maistro_images_usage" {
  name           = "${var.platform_name}-${var.environment}-images-usage"
  billing_mode   = "PROVISIONED"
  hash_key       = "OwnerId"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "OwnerId"
    type = "S"
  }

  global_secondary_index {
    name            = "OwnerId-index"
    hash_key        = "OwnerId"
    projection_type = "ALL"

    read_capacity  = 1
    write_capacity = 1
  }

  tags = local.tags
}
