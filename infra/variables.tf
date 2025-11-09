variable "project_name" {
  description = "Base name for Azure resources."
  type        = string
  default     = "vsme-report"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, prod)."
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "westeurope"
}

variable "tags" {
  description = "Common tags applied to all resources."
  type        = map(string)
  default = {
    managed-by = "terraform"
  }
}

variable "swa_sku_tier" {
  description = "SKU tier for Azure Static Web App."
  type        = string
  default     = "Standard"
}

variable "swa_sku_size" {
  description = "SKU size for Azure Static Web App."
  type        = string
  default     = "Standard"
}

variable "app_service_sku_name" {
  description = "App Service Plan SKU name (must support Always On)."
  type        = string
  default     = "P1v2"
}

variable "app_service_linux_fx_version" {
  description = "Linux runtime stack for the App Service (e.g. JAVA|17, JAVA|11)."
  type        = string
  default     = "JAVA|17"
}

variable "app_settings" {
  description = "Additional app settings to merge into the App Service configuration."
  type        = map(string)
  default     = {}
}

