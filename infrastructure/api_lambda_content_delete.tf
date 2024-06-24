# # IAM ROLE
# data "aws_iam_policy_document" "api_lambda_content_delete" {
#   statement {
#     effect = "Allow"

#     principals {
#       type        = "Service"
#       identifiers = ["lambda.amazonaws.com"]
#     }

#     actions = [
#       "sts:AssumeRole"
#     ]
#   }
# }

# resource "aws_iam_role" "api_lambda_content_delete" {
#   name               = "${local.api_bucket_name}-content-delete"
#   assume_role_policy = data.aws_iam_policy_document.api_lambda_content_delete.json

#   tags = {
#     application = "${lookup(local.tags, "application")}"
#     environment = "${lookup(local.tags, "environment")}"
#     gitRepo     = "${lookup(local.tags, "git_repo")}"
#     managedBy   = "${lookup(local.tags, "managed_by")}"
#   }
# }

# # IAM POLICY
# resource "aws_iam_policy" "api_lambda_content_delete_logs" {
#   name = "${local.api_bucket_name}-content-delete-logs"
#   policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [
#       {
#         Action : [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents",

#         ],
#         Effect : "Allow",
#         Resource : ["*"]
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "api_lambda_content_delete_logs" {
#   role       = aws_iam_role.api_lambda_content_delete.id
#   policy_arn = aws_iam_policy.api_lambda_content_delete_logs.arn
# }


# resource "aws_iam_policy" "api_lambda_content_delete_dynamo" {
#   name = "${local.api_bucket_name}-content-delete-dynamo"
#   policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [
#       {
#         Action : [
#           "dynamodb:DeleteItem",
#         ],
#         Effect : "Allow",
#         Resource : [
#           "${aws_dynamodb_table.content.arn}",
#           "${aws_dynamodb_table.content.arn}/index/*"
#         ]
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "api_lambda_content_delete_dynamo" {
#   role       = aws_iam_role.api_lambda_content_delete.id
#   policy_arn = aws_iam_policy.api_lambda_content_delete_dynamo.arn
# }

# ## LAMBDA
# data "archive_file" "api_lambda_content_delete" {
#   type = "zip"

#   source_dir  = "${path.module}/../packages/api/dist/content-delete"
#   output_path = "${path.module}/content-delete.zip"
# }


# resource "aws_s3_object" "api_lambda_content_delete" {
#   bucket = aws_s3_bucket.api.id

#   key    = "content-delete.zip"
#   source = data.archive_file.api_lambda_content_delete.output_path

#   etag = filemd5(data.archive_file.api_lambda_content_delete.output_path)
# }

# resource "aws_lambda_function" "api_lambda_content_delete" {
#   function_name = "${local.api_bucket_name}-content-delete"

#   handler = "index.handler"
#   runtime = "nodejs20.x"

#   s3_bucket = aws_s3_bucket.api.id
#   s3_key    = aws_s3_object.api_lambda_content_delete.key

#   role             = aws_iam_role.api_lambda_content_delete.arn
#   source_code_hash = data.archive_file.api_lambda_content_delete.output_base64sha256

#   environment {
#     variables = {
#       TABLE_NAME = "${aws_dynamodb_table.content.name}"
#     }
#   }

#   tags = {
#     application = "${lookup(local.tags, "application")}"
#     environment = "${lookup(local.tags, "environment")}"
#     gitRepo     = "${lookup(local.tags, "git_repo")}"
#     managedBy   = "${lookup(local.tags, "managed_by")}"
#   }
# }

# ## LOGS
# resource "aws_cloudwatch_log_group" "api_lambda_content_delete" {
#   name              = "/aws/lambda/${aws_lambda_function.api_lambda_content_delete.function_name}"
#   retention_in_days = 1
#   lifecycle {
#     prevent_destroy = false
#   }
# }

# ## API GATEWAY
# resource "aws_apigatewayv2_integration" "api_lambda_content_delete" {
#   api_id = aws_apigatewayv2_api.api.id

#   integration_type = "AWS_PROXY"
#   integration_uri  = aws_lambda_function.api_lambda_content_delete.invoke_arn
# }

# resource "aws_apigatewayv2_route" "api_lambda_content_delete" {
#   api_id    = aws_apigatewayv2_api.api.id
#   route_key = "DELETE /projects/{project-id}/content/{content-id}"

#   target = "integrations/${aws_apigatewayv2_integration.api_lambda_content_delete.id}"
# }

# resource "aws_lambda_permission" "api_lambda_content_delete" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.api_lambda_content_delete.function_name
#   principal     = "apigateway.amazonaws.com"

#   source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
# }
