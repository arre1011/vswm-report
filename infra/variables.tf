/*
  ℹ️ Variables = Stellschrauben deiner Infrastruktur.
  Du kannst sie in terraform.tfvars, via CLI oder über CI setzen.
*/

variable "project_name" {
  description = "Basisname für alle Azure-Ressourcen – wird in Kombination mit der Umgebung genutzt."
  type        = string
  default     = "vsme-report"
}

variable "environment" {
  description = "Umgebung (z. B. dev, prod). Dient vor allem zur Namensgebung."
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "westeurope"
}

variable "tags" {
  description = "Zusätzliche Tags, die auf jede Ressource geschrieben werden."
  type        = map(string)
  default = {
    managed-by = "terraform"
  }
}

variable "swa_sku_tier" {
  description = "Azure Static Web App SKU (Standard ermöglicht benutzerdefinierte Domains & Staging)."
  type        = string
  default     = "Standard"
}

variable "swa_sku_size" {
  description = "Azure Static Web App Größe (in der Regel wie der Tier-Wert)."
  type        = string
  default     = "Standard"
}

variable "app_service_sku_name" {
  description = "App Service Plan SKU Name (P1v2 = Produktionstauglich, Always On)."
  type        = string
  default     = "P1v2"
}

variable "app_service_linux_fx_version" {
  description = "Linux Runtime Stack für den App Service, Format <STACK>|<VERSION>."
  type        = string
  default     = "JAVA|17"
}

variable "app_settings" {
  description = "Optionale zusätzliche App Settings, die in den App Service übernommen werden."
  type        = map(string)
  default     = {}
}

