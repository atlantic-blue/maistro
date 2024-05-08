resource "aws_dynamodb_table" "ai_content" {
  name           = "${var.project_name}-ai-content"
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
