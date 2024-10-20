resource "aws_dynamodb_table" "projects" {
  name         = "${var.project_name}-projects"
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
    name = "url"
    type = "S"
  }

  global_secondary_index {
    name               = "UrlIndex"
    hash_key           = "url"
    projection_type    = "INCLUDE"
    non_key_attributes = ["userId", "id"]
    read_capacity      = 1
    write_capacity     = 1
  }

  global_secondary_index {
    name            = "idIndex"
    hash_key        = "id"
    projection_type = "ALL"
    read_capacity   = 1
    write_capacity  = 1
  }
}

resource "aws_dynamodb_table" "pages" {
  name         = "${var.project_name}-pages"
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
    name            = "ProjectIdIndex"
    hash_key        = "projectId"
    projection_type = "ALL"

    read_capacity  = 1
    write_capacity = 1
  }
}

resource "aws_dynamodb_table" "content" {
  name         = "${var.project_name}-content"
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
    name            = "ProjectIdIndex"
    hash_key        = "projectId"
    projection_type = "ALL"

    read_capacity  = 1
    write_capacity = 1
  }
}
