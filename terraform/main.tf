# 1. AWS Provider and Version Configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Latest version to avoid 'resolve_conflicts' errors
    }
  }
}

provider "aws" {
  region = "us-east-1" # Aap apna region yahan change kar sakte hain
}

# 2. VPC Module (Creating the Network for EKS)
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "agri-system-vpc"
  cidr = "10.0.0.0/16"

  # EKS needs at least 2 Availability Zones
  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1" # Important for Load Balancers
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }
}