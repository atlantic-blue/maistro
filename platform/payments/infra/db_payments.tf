resource "aws_dynamodb_table" "payments" {
  name           = "${var.platform_name}-${var.environment}-payments"
  hash_key     = "PaymentId"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  
  attribute {
    name = "PaymentId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "entitlements" {
  name         = "${var.platform_name}-${var.environment}-entitlements"
  hash_key     = "BusinessId"
  range_key    = "CustomerId"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  
  attribute {
    name = "BusinessId"
    type = "S"
  }
  
  attribute {
    name = "CustomerId"
    type = "S"
  }
}