import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { FORTIS, FORTIS_CORE_STORY_VERBATIM } from "@/lib/constants";

const styles = StyleSheet.create({
  page: {
    padding: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1f2937",
    lineHeight: 1.45,
  },
  h1: {
    fontSize: 18,
    color: "#003087",
    marginBottom: 4,
    fontWeight: "bold",
  },
  sub: {
    fontSize: 10,
    color: "#F5A623",
    marginBottom: 12,
  },
  tag: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 16,
  },
  h2: {
    fontSize: 11,
    color: "#003087",
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "bold",
  },
  bullet: { marginLeft: 10, marginBottom: 3 },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 8,
    color: "#6b7280",
  },
});

export function FortisEdgeBriefPdfDocument({
  name,
  org,
  generatedAt,
}: {
  name: string;
  org: string;
  generatedAt: string;
}) {
  return (
    <Document title="Fortis Edge — Stakeholder Brief">
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.h1}>Fortis Edge — Stakeholder Brief</Text>
        <Text style={styles.sub}>{FORTIS.company}</Text>
        <Text style={styles.tag}>{FORTIS.tagline}</Text>

        <Text style={styles.h2}>Audience</Text>
        <Text>
          {name || "—"} · {org || "—"}
        </Text>

        <Text style={styles.h2}>Positioning</Text>
        <Text>{FORTIS.subhead}</Text>

        <Text style={styles.h2}>Core story (verbatim)</Text>
        <Text>{FORTIS_CORE_STORY_VERBATIM}</Text>

        <Text style={styles.h2}>Roadmap highlights (targets)</Text>
        <Text style={styles.bullet}>
          • Online proofing — Mar 1, 2026 (Orem target)
        </Text>
        <Text style={styles.bullet}>• FlexLink — Mar 15, 2026 target</Text>
        <Text style={styles.bullet}>
          • Split shipping — Apr 30, 2026 target
        </Text>
        <Text style={styles.bullet}>
          • April 2026 portal update — live
        </Text>

        <Text style={styles.h2}>Integrations (roadmap)</Text>
        <Text style={styles.bullet}>• Radius — MIS connectivity</Text>
        <Text style={styles.bullet}>• Infigo — web-to-print alignment</Text>
        <Text style={styles.bullet}>• LabelTraxx — production workflow sync</Text>

        <View style={styles.footer}>
          <Text>
            Generated {generatedAt}. Demo document — not a commercial offer or
            binding commitment.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
