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
