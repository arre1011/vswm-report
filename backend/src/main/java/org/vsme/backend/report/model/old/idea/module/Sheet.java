package org.vsme.backend.report.model;

import java.util.List;

public record Sheet (String name, List<Disclosure> disclosures){
}
