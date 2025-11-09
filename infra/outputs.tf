/*
  📤 Outputs = nützliche Informationen nach dem Terraform-Lauf.
  Sie erscheinen sowohl im CLI als auch in GitHub Actions Logs.
*/

output "resource_group_name" {
  description = "Resource Group mit allen erzeugten Ressourcen."
  value       = azurerm_resource_group.main.name
}

output "static_site_name" {
  description = "Name der Azure Static Web App – wird im Frontend-Workflow benötigt."
  value       = azurerm_static_site.frontend.name
}

output "static_site_default_hostname" {
  description = "Standard-Hostname der Static Web App (z. B. purple-river-1234.azurestaticapps.net)."
  value       = azurerm_static_site.frontend.default_host_name
}

output "app_service_name" {
  description = "Name des App Service (Backend)."
  value       = azurerm_linux_web_app.backend.name
}

output "app_service_default_hostname" {
  description = "Standard-Hostname des App Service (für Healthchecks)."
  value       = azurerm_linux_web_app.backend.default_hostname
}

output "application_insights_connection_string" {
  description = "Connection String für Application Insights (sensitiv, nicht veröffentlichen)."
  value       = azurerm_application_insights.backend.connection_string
  sensitive   = true
}

