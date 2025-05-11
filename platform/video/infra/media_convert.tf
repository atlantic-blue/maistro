resource "aws_iam_role" "mediaconvert_role" {
  name = "${var.platform_name}-mediaconvert-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "mediaconvert.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    local.tags,
    {
      managedBy = "Terraform",
    }
  )
}

resource "aws_iam_role_policy" "mediaconvert_policy" {
  name = "${var.platform_name}-mediaconvert-policy"
  role = aws_iam_role.mediaconvert_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = [
          "${aws_s3_bucket.video_input.arn}/*",
          "${aws_s3_bucket.video_output.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_media_convert_queue" "queue" {
  name = "${var.platform_name}-queue"

  tags = merge(
    local.tags,
    {
      managedBy = "Terraform",
    }
  )
}
