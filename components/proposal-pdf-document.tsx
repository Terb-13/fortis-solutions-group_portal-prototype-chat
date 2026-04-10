import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { FORTIS } from "@/lib/constants";

const styles = StyleSheet.create({
  page: {
    padding: 44,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: "#1f2937",
    lineHeight: 1.45,
  },
  h1: {
    fontSize: 20,
    color: "#003087",
    marginBottom: 4,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 11,
    color: "#F5A623",
    marginBottom: 16,
  },
  tagline: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 20,
  },
  section: {
    marginTop: 14,
  },
  h2: {
    fontSize: 12,
    color: "#003087",
    marginBottom: 8,
    fontWeight: "bold",
  },
  row: {
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    color: "#003087",
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 3,
  },
  footer: {
    marginTop: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 8.5,
    color: "#6b7280",
  },
});

export type ProposalPdfInput = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  projectName: string;
  notes: string;
  lines: { name: string; qty: number; notes?: string }[];
};

export function FortisProposalPdfDocument({
  data,
  generatedAt,
}: {
  data: ProposalPdfInput;
  generatedAt: string;
}) {
  return (
    <Document title="Fortis Packaging Proposal V.1">
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.h1}>Fortis Packaging Proposal V.1</Text>
        <Text style={styles.subtitle}>{FORTIS.company}</Text>
        <Text style={styles.tagline}>{FORTIS.tagline}</Text>

        <View style={styles.section}>
          <Text style={styles.h2}>Customer</Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Company: </Text>
            {data.company || "—"}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Contact: </Text>
            {data.contact || "—"}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Email: </Text>
            {data.email || "—"}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Phone: </Text>
            {data.phone || "—"}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Project: </Text>
            {data.projectName || "—"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Scope (from explorer)</Text>
          {data.lines.length === 0 ? (
            <Text style={styles.row}>No product lines selected.</Text>
          ) : (
            data.lines.map((line, i) => (
              <Text key={`${line.name}-${i}`} style={styles.bullet}>
                • {line.name} — Qty {line.qty}
                {line.notes ? ` — ${line.notes}` : ""}
              </Text>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Program notes</Text>
          <Text style={styles.row}>{data.notes || "—"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>How Fortis helps</Text>
          <Text style={styles.bullet}>
            • Premium pressure-sensitive labels, shrink sleeves, flexible
            packaging, folding cartons, and applicator programs (Gold Seal &
            CTM).
          </Text>
          <Text style={styles.bullet}>
            • RENEW™ sustainable options supporting wash-off and recyclable
            constructions where applicable.
          </Text>
          <Text style={styles.bullet}>
            • Portal-aligned collaboration: estimates, proofing, order status,
            and RFP workflows through your Fortis team.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Generated {generatedAt}. This document is a demo proposal summary
            for {FORTIS.productName} and does not constitute a binding quote.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
