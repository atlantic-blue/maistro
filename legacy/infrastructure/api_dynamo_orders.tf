resource "aws_dynamodb_table" "orders" {
  name         = "${var.project_name}-orders"
  billing_mode = "PROVISIONED"

  read_capacity  = 1 // TODO investigate limits
  write_capacity = 1

  hash_key  = "id"
  range_key = "projectId"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "projectId"
    type = "S"
  }

  attribute {
    name = "shoppingCartId"
    type = "S"
  }

  global_secondary_index {
    name            = "idIndex"
    hash_key        = "id"
    projection_type = "ALL"

    read_capacity  = 1
    write_capacity = 1
  }

  global_secondary_index {
    name            = "ProjectIdIndex"
    hash_key        = "projectId"
    projection_type = "ALL"

    read_capacity  = 1
    write_capacity = 1
  }

  global_secondary_index {
    name            = "ShoppingCartIdIndex"
    hash_key        = "shoppingCartId"
    projection_type = "ALL"

    read_capacity  = 1
    write_capacity = 1
  }
}
