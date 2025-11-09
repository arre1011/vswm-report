output "resource_group_name" {
  description = "Name of the resource group containing all Azure resources."
  value       = azurerm_resource_group.main.name
}

output "static_site_name" {
  description = "Name of the Azure Static Web App."
  value       = azurerm_static_site.frontend.name
}

output "static_site_default_hostname" {
  description = "Default hostname of the Azure Static Web App."
  value       = azurerm_static_site.frontend.default_host_name
}

output "app_service_name" {
  description = "Name of the Azure App Service hosting the backend."
  value       = azurerm_linux_web_app.backend.name
}

output "app_service_default_hostname" {
  description = "Default hostname of the backend App Service."
  value       = azurerm_linux_web_app.backend.default_hostname
}

output "application_insights_connection_string" {
  description = "Connection string for Application Insights."
  value       = azurerm_application_insights.backend.connection_string
  sensitive   = true
}

