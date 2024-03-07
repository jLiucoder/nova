
# S3 bucket for user files
resource "aws_s3_bucket" "nova-bucket" {
    bucket = "nova-user-files-bucket"
}

resource "aws_s3_bucket_public_access_block" "nove-bucket-access" {
  bucket = aws_s3_bucket.nova-bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "nova-bucket-ownership" {
  bucket = aws_s3_bucket.nova-bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_policy" "allow_public_read" {
  depends_on = [ aws_s3_bucket_public_access_block.nove-bucket-access ]
  bucket = aws_s3_bucket.nova-bucket.id
  policy = data.aws_iam_policy_document.nova-bucket-policy.json
}

data "aws_iam_policy_document" "nova-bucket-policy" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    actions   = ["s3:GetObject"]
    resources = [aws_s3_bucket.nova-bucket.arn, "${aws_s3_bucket.nova-bucket.arn}/*"]
  }
}

# create ECR repository
# resource "aws_ecr_repository" "nova_image" {
#   name                 = "nova-image2"
#   image_tag_mutability = "MUTABLE"

#   image_scanning_configuration {
#     scan_on_push = true
#   }
# }

# sqs queue for user files
# resource "aws_sqs_queue" "nova-sqs" {
#   name                        = "nova-sqs.fifo"
#   fifo_queue                  = true
#   content_based_deduplication = true
# }

# resource "aws_elasticache_cluster" "nova-redis" {
#   cluster_id           = "nova-redis"
#   engine               = "redis"
#   node_type            = "cache.t2.micro"
#   num_cache_nodes      = 1
#   port                 = 6379
# }
