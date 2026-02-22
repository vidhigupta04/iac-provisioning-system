module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "agri-provisioning-cluster"
  cluster_version = "1.27"

  # Referencing the VPC module from main.tf
  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  # Default Node Group (Worker Nodes)
  eks_managed_node_groups = {
    general = {
      desired_size = 2
      min_size     = 1
      max_size     = 3

      instance_types = ["t3.medium"] # Minimum recommended for EKS
      capacity_type  = "ON_DEMAND"
    }
  }

  # Manage aws-auth configmap (for cluster access)
  manage_aws_auth_configmap = true
}