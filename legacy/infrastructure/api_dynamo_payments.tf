resource "aws_dynamodb_table" "payments_accounts" {
  name         = "${var.project_name}-payments-accounts"
  billing_mode = "PROVISIONED"

  read_capacity  = 1 // TODO investigate limits
  write_capacity = 1

  hash_key  = "userId"
  range_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "payments_checkouts" {
  name         = "${var.project_name}-payments-checkouts"
  billing_mode = "PROVISIONED"

  read_capacity  = 1 // TODO investigate limits
  write_capacity = 1

  hash_key  = "projectId"
  range_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "projectId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "payments_shopping_carts" {
  name         = "${var.project_name}-payments-shopping-carts"
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

  global_secondary_index {
    name            = "IdIndex"
    hash_key        = "id"
    read_capacity   = 1
    write_capacity  = 1
    projection_type = "ALL"
  }
}

# Currently used for mercado pago
resource "aws_dynamodb_table" "payments_process" {
  name         = "${var.project_name}-payments-process"
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
}
