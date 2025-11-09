# Terraform backend configuration lives here.
# The azurerm backend requires initialization with environment-specific
# values that are intentionally left blank for security.
#
# Example (adjust identifiers):
# terraform init \
#   -backend-config="resource_group_name=rg-terraform" \
#   -backend-config="storage_account_name=stterraformstate" \
#   -backend-config="container_name=tfstate" \
#   -backend-config="key=vsme-report-dev.tfstate"
#
# Alternatively, create a backend.hcl file and reference it during init.

