resource "aws_apigatewayv2_api" "api" {
  name          = "${var.product_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "*"
    ]
    allow_methods = [
      "HEAD",
      "OPTIONS",
      "GET",
      "PATCH",
      "POST",
      "PUT",
      "DELETE",
    ]
    allow_headers = [
      "Content-Type",
      "Authorization",
    ]
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "api" {
  name = "/aws/api-gw/${aws_apigatewayv2_api.api.name}"

  retention_in_days = 1

  tags = var.tags
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id = aws_apigatewayv2_api.api.id

  name        = "prod"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = var.api_domain_name

  domain_name_configuration {
    certificate_arn = var.acm_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = aws_apigatewayv2_api.api.id
  domain_name = aws_apigatewayv2_domain_name.api.id
  stage       = aws_apigatewayv2_stage.prod.id
}

resource "aws_apigatewayv2_api_mapping" "api_v1" {
  api_id          = aws_apigatewayv2_api.api.id
  domain_name     = aws_apigatewayv2_domain_name.api.id
  stage           = aws_apigatewayv2_stage.prod.id
  api_mapping_key = "v1"
}
