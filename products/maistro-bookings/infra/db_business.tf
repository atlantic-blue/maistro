# resource "aws_dynamodb_table" "maistro_users" {
#   name           = "${var.product_name}-${var.environment}-users"
#   billing_mode   = "PROVISIONED"
#   hash_key       = "UserId"
#   read_capacity  = 1
#   write_capacity = 1

#   attribute {
#     name = "UserId"
#     type = "S"
#   }

#   attribute {
#     name = "CognitoUserId"
#     type = "S"
#   }

#   # Global Secondary Index for querying by Cognito User ID
#   global_secondary_index {
#     name            = "CognitoUserId-index"
#     hash_key        = "CognitoUserId"
#     projection_type = "ALL"

#     read_capacity   = 1
#     write_capacity  = 1
#   }

#   tags = local.tags
# }

# resource "aws_dynamodb_table" "maistro_user_profiles" {
#   name           = "${var.platform_name}-${var.environment}-users-profile"
#   billing_mode   = "PROVISIONED"
#   hash_key       = "UserId"
#   read_capacity  = 1
#   write_capacity = 1

#   attribute {
#     name = "UserId"
#     type = "S"
#   }

#   global_secondary_index {
#     name            = "UserIdIndex"
#     hash_key        = "UserId"
#     projection_type = "ALL"

#     read_capacity  = 1
#     write_capacity = 1
#   }

#   tags = local.tags
# }
