locals {
  tags = {
    product = "${var.platform_name}"
    environment = "${var.environment}"
    gitRepo    = "github.com/atlantic-blue/maistro"
  }
}
