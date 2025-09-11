locals {
  tags = {
    product     = "${var.product_name}"
    environment = "${var.environment}"
    gitRepo     = "github.com/atlantic-blue/maistro"
  }
}