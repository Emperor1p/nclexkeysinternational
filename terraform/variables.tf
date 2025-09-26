# Terraform variables for NCLEX Virtual School infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "nclex"
}

variable "db_password" {
  description = "Database password for RDS instance"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}

variable "instance_type" {
  description = "EC2 instance type for the application"
  type        = string
  default     = "t3.micro"
}

variable "min_capacity" {
  description = "Minimum number of instances in Auto Scaling Group"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of instances in Auto Scaling Group"
  type        = number
  default     = 3
}

variable "desired_capacity" {
  description = "Desired number of instances in Auto Scaling Group"
  type        = number
  default     = 2
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_clusters" {
  description = "Number of cache clusters in ElastiCache Redis"
  type        = number
  default     = 1
}

variable "backup_retention_period" {
  description = "RDS backup retention period in days"
  type        = number
  default     = 7
}

variable "multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = false
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for RDS"
  type        = bool
  default     = true
}

variable "cpu_threshold_high" {
  description = "CPU threshold for scaling up"
  type        = number
  default     = 80
}

variable "cpu_threshold_low" {
  description = "CPU threshold for scaling down"
  type        = number
  default     = 20
}

variable "health_check_grace_period" {
  description = "Health check grace period for Auto Scaling Group"
  type        = number
  default     = 300
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}

