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
}

resource "aws_dynamodb_table" "asset" {
  name         = "${var.project_name}-assets"
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
