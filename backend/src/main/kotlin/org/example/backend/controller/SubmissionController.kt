package org.example.backend.controller

import org.example.backend.dto.SubmitResponseDto
import org.example.backend.dto.WizardDataDto
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5173", "http://localhost:3000"])
class SubmissionController {

    @PostMapping("/submit")
    fun submitData(@RequestBody data: WizardDataDto): ResponseEntity<SubmitResponseDto> {
        try {
            // Validierung
            if (data.address.name.isBlank()) {
                return ResponseEntity.badRequest().body(
                    SubmitResponseDto(
                        success = false,
                        message = "Name darf nicht leer sein"
                    )
                )
            }

            if (data.email.email.isBlank() || !data.email.email.contains("@")) {
                return ResponseEntity.badRequest().body(
                    SubmitResponseDto(
                        success = false,
                        message = "Ungültige E-Mail-Adresse"
                    )
                )
            }

            if (data.email.email != data.email.confirmEmail) {
                return ResponseEntity.badRequest().body(
                    SubmitResponseDto(
                        success = false,
                        message = "E-Mail-Adressen stimmen nicht überein"
                    )
                )
            }

            val validCurrencies = listOf("EUR", "USD", "GBP", "JPY")
            if (!validCurrencies.contains(data.personal.currency)) {
                return ResponseEntity.badRequest().body(
                    SubmitResponseDto(
                        success = false,
                        message = "Ungültige Währung"
                    )
                )
            }

            // Hier könnten Sie die Daten in eine Datenbank speichern
            // z.B. repository.save(data)
            
            println("Daten empfangen: $data")

            return ResponseEntity.ok(
                SubmitResponseDto(
                    success = true,
                    message = "Daten erfolgreich empfangen und verarbeitet"
                )
            )
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                SubmitResponseDto(
                    success = false,
                    message = "Fehler beim Verarbeiten der Daten: ${e.message}"
                )
            )
        }
    }
}

