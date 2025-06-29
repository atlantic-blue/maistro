resource "aws_dynamodb_table" "maistro_users" {
  name           = "${var.platform_name}-${var.environment}-users"
  billing_mode   = "PROVISIONED"
  hash_key       = "UserId"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "CognitoUserId"
    type = "S"
  }

  attribute {
    name = "Email"
    type = "S"
  }

  # Global Secondary Index for querying by Cognito User ID
  global_secondary_index {
    name            = "CognitoUserId-index"
    hash_key        = "CognitoUserId"
    read_capacity   = 1
    write_capacity  = 1
    projection_type = "ALL"
  }

  # Global Secondary Index for querying by Email
  global_secondary_index {
    name            = "Email-index"
    hash_key        = "Email"
    read_capacity   = 1
    write_capacity  = 1
    projection_type = "ALL"
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "maistro_user_profiles" {
  name           = "${var.platform_name}-${var.environment}-users-profile"
  billing_mode   = "PROVISIONED"
  hash_key       = "UserId"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "UserId"
    type = "S"
  }

  tags = local.tags
}
