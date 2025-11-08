package org.example.backend.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class AddressDataDto(
    @JsonProperty("name") val name: String,
    @JsonProperty("street") val street: String,
    @JsonProperty("houseNumber") val houseNumber: String,
    @JsonProperty("city") val city: String
)

data class EmailDataDto(
    @JsonProperty("email") val email: String,
    @JsonProperty("confirmEmail") val confirmEmail: String
)

data class PersonalDataDto(
    @JsonProperty("currency") val currency: String // EUR, USD, GBP, JPY
)

data class WizardDataDto(
    @JsonProperty("address") val address: AddressDataDto,
    @JsonProperty("email") val email: EmailDataDto,
    @JsonProperty("personal") val personal: PersonalDataDto
)

data class SubmitResponseDto(
    @JsonProperty("success") val success: Boolean,
    @JsonProperty("message") val message: String,
    @JsonProperty("timestamp") val timestamp: String = java.time.Instant.now().toString()
)

