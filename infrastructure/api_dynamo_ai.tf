resource "aws_dynamodb_table" "ai_images_usage" {
  name           = "${var.project_name}-ai-images-usage"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userId"
  range_key      = "createdAt"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ai_templates" {
  name           = "${var.project_name}-ai-template"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ai_components_usage" {
  name           = "${var.project_name}-ai-components-usage"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userId"
  range_key      = "createdAt"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }
}

resource "aws_dynamodb_table" "ai_threads" {
  name           = "${var.project_name}-ai-threads"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1

  hash_key  = "userId"
  range_key = "createdAt"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  attribute {
    name = "updatedAt"
    type = "S"
  }

  attribute {
    name = "projectId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  global_secondary_index {
    name            = "threadIdIndex"
    hash_key        = "id"
    read_capacity   = 1
    write_capacity  = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "ProjectIdIndex"
    hash_key        = "projectId"
    read_capacity   = 1
    write_capacity  = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "UserIdUpdatedAtIndex"
    hash_key        = "userId"
    range_key       = "updatedAt"
    read_capacity   = 1
    write_capacity  = 1
    projection_type = "ALL"
  }
}

