package org.vsme.backend.report.model.stepper;

import org.vsme.backend.report.model.Disclosure;

import java.util.List;

public record GovernanceDisclosures (List<Disclosure> disclosures) {
}
