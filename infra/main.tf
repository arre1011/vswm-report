locals {
  /*
    🔤 Lokale Hilfswerte:
    - base_name: Grundgerüst für Ressourcennamen (z. B. vsme-report-dev)
    - tags: vereinheitlichte Tags für Monitoring/Abrechnung
  */
  base_name      = "${var.project_name}-${var.environment}"
  resource_group = "${local.base_name}-rg"
  tags = merge(
    var.tags,
    {
      project     = var.project_name
      environment = var.environment
    }
  )
}

resource "random_string" "global_suffix" {
  # Viele Azure-Ressourcen (z. B. Static Web App) brauchen eindeutige Namen – der Suffix verhindert Kollisionen.
  length  = 5
  upper   = false
  lower   = true
  numeric = true
  special = false
}

resource "azurerm_resource_group" "main" {
  # Zentraler Container für alle Ressourcen dieser Umgebung.
  name     = local.resource_group
  location = var.location
  tags     = local.tags
}

resource "azurerm_application_insights" "backend" {
  # Monitoring-Instanz für das Backend (Requests, Logs, Abhängigkeiten).
  name                = "${replace(local.base_name, "-", "")}-appi-${random_string.global_suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"

  tags = local.tags
}

resource "azurerm_static_site" "frontend" {
  # Azure Static Web App für das React-Frontend – Build & Deploy via GitHub Actions.
  name                = "${replace(local.base_name, "-", "")}-swa-${random_string.global_suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  sku_tier = var.swa_sku_tier
  sku_size = var.swa_sku_size

  tags = local.tags
}

resource "azurerm_service_plan" "backend" {
  # App Service Plan (Linux). Hier laufen ein oder mehrere Web Apps mit gemeinsamem Compute.
  name                = "${local.base_name}-plan"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = var.app_service_sku_name

  tags = local.tags
}

resource "azurerm_linux_web_app" "backend" {
  # Das eigentliche Spring-Boot Backend, Always On, mit Application Insights verkabelt.
  name                = "${local.base_name}-app"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.backend.id

  https_only = true

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on = true
    ftps_state = "Disabled"
    linux_fx_version = var.app_service_linux_fx_version
  }

  app_settings = merge(
    {
      # Die wichtigsten Einstellungen: Deployment-Methodik & Application Insights Agent.
      "WEBSITE_RUN_FROM_PACKAGE"                = "1"
      "SCM_DO_BUILD_DURING_DEPLOYMENT"          = "false"
      "APPLICATIONINSIGHTS_CONNECTION_STRING"   = azurerm_application_insights.backend.connection_string
      "APPINSIGHTS_INSTRUMENTATIONKEY"          = azurerm_application_insights.backend.instrumentation_key
      "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"
      "APPLICATIONINSIGHTS_AGENT_VERSION"       = "latest"
      "APPLICATIONINSIGHTS_PROFILERFEATURE_VERSION" = "disabled"
      "APPLICATIONINSIGHTS_SNAPSHOTFEATURE_VERSION" = "disabled"
    },
    var.app_settings
  )

  logs {
    # Aktiviert serverseitige Logs – hilfreich beim Debugging.
    application_logs {
      file_system_level = "Error"
    }

    http_logs {
      file_system {
        retention_in_mb   = 100
        retention_in_days = 7
      }
    }
  }

  tags = local.tags
}

