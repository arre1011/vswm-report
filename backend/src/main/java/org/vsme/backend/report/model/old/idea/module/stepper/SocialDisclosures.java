package org.vsme.backend.report.model.old.idea.module.stepper;

import org.vsme.backend.report.model.old.idea.module.Disclosure;

import java.util.List;

public record SocialDisclosures (String name, List<Disclosure> disclosures){
}
