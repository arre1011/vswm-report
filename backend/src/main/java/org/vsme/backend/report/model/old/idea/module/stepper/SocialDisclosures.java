package org.vsme.backend.report.model.stepper;

import org.vsme.backend.report.model.Disclosure;

import java.util.List;

public record SocialDisclosures (String name, List<Disclosure> disclosures){
}
