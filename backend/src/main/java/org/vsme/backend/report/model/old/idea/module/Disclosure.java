package org.vsme.backend.report.model;

import java.util.List;

public record Disclosure (String name, List<Datapoint> datapoints) {
}
