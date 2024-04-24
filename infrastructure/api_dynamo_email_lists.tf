resource "aws_dynamodb_table" "email_lists" {
  name         = "${var.project_name}-email-lists"
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

 attribute {
    name = "projectId"
    type = "S"
  }

  global_secondary_index {
    name               = "ProjectIdIndex"
    hash_key           = "projectId"
    projection_type    = "INCLUDE"
    non_key_attributes = ["userId", "id"]
    read_capacity      = 1
    write_capacity     = 1
  }
}

resource "aws_dynamodb_table" "email_entries" {
  name         = "${var.project_name}-email-entries"
  billing_mode = "PROVISIONED"

  read_capacity  = 1 // TODO investigate limits
  write_capacity = 1

  hash_key  = "emailListId"
  range_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "emailListId"
    type = "S"
  }
}
