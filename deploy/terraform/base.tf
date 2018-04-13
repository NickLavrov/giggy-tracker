
variable "region" {default="us-east-1"}

provider "aws" {
  region = "${var.region}"
}

terraform {
  backend "s3" {
    bucket = "gigster-network-terraform"
    key    = "giggy-tracker/terraform.tfstate"
    region = "us-east-1"
  }
}
