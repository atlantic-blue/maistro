resource "aws_vpc" "platform_video_processor" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = merge(
    local.tags, {
        managed_by: "Terraform"
    }
  )
}

resource "aws_vpc_endpoint" "api_gateway" {
  vpc_id              = aws_vpc.platform_video_processor.id
  service_name        = "com.amazonaws.${var.aws_region}.execute-api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  
  subnet_ids = []
  
  security_group_ids = [
    aws_security_group.api_gateway_endpoint.id
  ]
  
  tags = merge(
    local.tags, {
        managed_by: "Terraform"
    }
  )
}

resource "aws_security_group" "api_gateway_endpoint" {
  name        = "${var.platform_name}-api-gateway-endpoint-sg"
  description = "Allow HTTPS from internal services"
  vpc_id      = aws_vpc.platform_video_processor.id
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [
        "10.0.0.0/16"
    ]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(
    local.tags, {
        managed_by: "Terraform"
    }
  )
}