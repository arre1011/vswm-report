import { useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { InputWithInfo } from "@/components/ui/input-with-info.tsx"

const entityNameSchema = z
  .string({
    required_error:
      "Please provide the legal entity name so we can reference a concrete reporting entity inside the XBRL contexts.",
    invalid_type_error:
      "Entity name must be text. Numbers or structured data would not be a valid legal name and could break the XBRL output.",
  })
  .trim()
  .min(3, {
    message:
      "Please enter at least three readable characters so the reporting entity can be uniquely identified.",
  })
  .max(120, {
    message:
      "Please stay under 120 characters. This keeps the exported disclosure compact and prevents denial-of-service style inputs.",
  })
  .regex(/^[\p{L}\p{N}\s.,'()&/-]+$/u, {
    message:
      "Only use letters, digits, spaces and safe punctuation such as . , ' ( ) & / -. This prevents script injection in Excel/XBRL.",
  })

const extractErrorMessage = (error: unknown): string | undefined => {
  if (!error) {
    return undefined
  }
  if (typeof error === "string") {
    return error
  }
  if (typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    return typeof message === "string" ? message : undefined
  }
  return undefined
}

interface EntityNameFieldProps {
  label: string
  value: string
  onUpdate: (value: string) => void
}

export function EntityNameField({ label, value, onUpdate }: EntityNameFieldProps) {
  /**
   * The dedicated form instance keeps validation, touched state and string normalization encapsulated so that the parent
   * component only needs to pass a simple `value` and `onUpdate`. This reduces coupling and makes it trivial to reuse the field.
   */
  const form = useForm({
    defaultValues: { entityName: value },
    onSubmit: async () => {},
  })

  useEffect(() => {
    const currentValue = form.getFieldValue("entityName")
    if (value !== currentValue) {
      form.setFieldValue("entityName", value, { dontUpdateMeta: true })
    }
  }, [value, form])

  return (
    <form.Field
      name="entityName"
      validators={{
        onChange: entityNameSchema,
        onBlur: entityNameSchema,
      }}
    >
      {(field) => {
        const shouldDisplayError = field.state.meta.isTouched || field.state.meta.isBlurred
        const fieldError = shouldDisplayError ? extractErrorMessage(field.state.meta.errors?.[0]) : undefined

        return (
          <InputWithInfo
            id="entityName"
            label={label}
            value={field.state.value ?? ""}
            onChange={(event) => {
              const nextValue = event.target.value
              field.handleChange(nextValue)
              onUpdate(nextValue)
            }}
            onBlur={(event) => {
              const normalizedValue = event.target.value.replace(/\s{2,}/g, " ").trim()
              if (normalizedValue !== event.target.value) {
                field.handleChange(normalizedValue)
                onUpdate(normalizedValue)
              }
              field.handleBlur()
            }}
            required
            placeholder="e.g. Company XYZ"
            infoTitle="N/A"
            infoDescription="N/A at the moment"
            error={fieldError}
          />
        )
      }}
    </form.Field>
  )
}
