terraform {
  required_version = ">= 1.6.0"

  backend "azurerm" {
    /*
      Configure the remote backend via terraform init, e.g.:

      terraform init \
        -backend-config="resource_group_name=rg-terraform" \
        -backend-config="storage_account_name=stterraformstate" \
        -backend-config="container_name=tfstate" \
        -backend-config="key=vsme-report-${var.environment}.tfstate"

      (Adjust the values above or move them into a backend.hcl file.)
    */
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.9.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6.2"
    }
  }
}

provider "azurerm" {
  features {}
}

