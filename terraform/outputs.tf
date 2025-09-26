# Terraform outputs for NCLEX Virtual School infrastructure

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.nclex_vpc.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.nclex_vpc.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.nclex_alb.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.nclex_alb.zone_id
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.nclex_alb.arn
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.nclex_tg.arn
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.nclex_db.endpoint
  sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.nclex_db.port
}

output "rds_db_name" {
  description = "RDS database name"
  value       = aws_db_instance.nclex_db.db_name
}

output "rds_username" {
  description = "RDS master username"
  value       = aws_db_instance.nclex_db.username
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis cluster primary endpoint"
  value       = aws_elasticache_replication_group.nclex_redis.primary_endpoint_address
  sensitive   = true
}

output "redis_port" {
  description = "Redis cluster port"
  value       = aws_elasticache_replication_group.nclex_redis.port
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for media files"
  value       = aws_s3_bucket.nclex_media.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.nclex_media.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.nclex_media.bucket_domain_name
}

output "autoscaling_group_name" {
  description = "Name of the Auto Scaling Group"
  value       = aws_autoscaling_group.nclex_asg.name
}

output "autoscaling_group_arn" {
  description = "ARN of the Auto Scaling Group"
  value       = aws_autoscaling_group.nclex_asg.arn
}

output "launch_template_id" {
  description = "ID of the launch template"
  value       = aws_launch_template.nclex_lt.id
}

output "launch_template_latest_version" {
  description = "Latest version of the launch template"
  value       = aws_launch_template.nclex_lt.latest_version
}

output "security_group_alb_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb_sg.id
}

output "security_group_ec2_id" {
  description = "ID of the EC2 security group"
  value       = aws_security_group.ec2_sg.id
}

output "security_group_rds_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds_sg.id
}

output "security_group_cache_id" {
  description = "ID of the ElastiCache security group"
  value       = aws_security_group.cache_sg.id
}

output "iam_role_ec2_arn" {
  description = "ARN of the EC2 IAM role"
  value       = aws_iam_role.ec2_role.arn
}

output "iam_instance_profile_name" {
  description = "Name of the IAM instance profile"
  value       = aws_iam_instance_profile.ec2_profile.name
}

output "cloudwatch_alarm_cpu_high_arn" {
  description = "ARN of the CPU high CloudWatch alarm"
  value       = aws_cloudwatch_metric_alarm.cpu_high.arn
}

output "cloudwatch_alarm_cpu_low_arn" {
  description = "ARN of the CPU low CloudWatch alarm"
  value       = aws_cloudwatch_metric_alarm.cpu_low.arn
}

# Connection strings and URLs
output "database_url" {
  description = "Database connection URL"
  value       = "postgresql://${aws_db_instance.nclex_db.username}:${var.db_password}@${aws_db_instance.nclex_db.endpoint}:${aws_db_instance.nclex_db.port}/${aws_db_instance.nclex_db.db_name}"
  sensitive   = true
}

output "redis_url" {
  description = "Redis connection URL"
  value       = "redis://${aws_elasticache_replication_group.nclex_redis.primary_endpoint_address}:${aws_elasticache_replication_group.nclex_redis.port}/0"
  sensitive   = true
}

output "application_url" {
  description = "Application URL (ALB DNS name)"
  value       = "http://${aws_lb.nclex_alb.dns_name}"
}

# Environment variables for application
output "environment_variables" {
  description = "Environment variables for the application"
  value = {
    DATABASE_URL = "postgresql://${aws_db_instance.nclex_db.username}:${var.db_password}@${aws_db_instance.nclex_db.endpoint}:${aws_db_instance.nclex_db.port}/${aws_db_instance.nclex_db.db_name}"
    REDIS_URL    = "redis://${aws_elasticache_replication_group.nclex_redis.primary_endpoint_address}:${aws_elasticache_replication_group.nclex_redis.port}/0"
    S3_BUCKET    = aws_s3_bucket.nclex_media.bucket
    AWS_REGION   = var.aws_region
  }
  sensitive = true
}

