package org.vsme.backend.report.model.old.idea.module;

import org.vsme.backend.report.model.Datapoint;

import java.util.List;

public record Disclosure (String name, List<Datapoint> datapoints) {
}
