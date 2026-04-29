import { TimelineRoadmapClient } from "@/components/timeline-roadmap-client";
import { FORTIS } from "@/lib/constants";
import { getPortalContent } from "@/lib/portal-data";

export const metadata = {
  title: `Timeline & Roadmap | ${FORTIS.productName}`,
  description:
    "Phase 2 milestones: FlexLink, online proofing, split shipping, integrations.",
};

export default function TimelineRoadmapPage() {
  return <TimelineRoadmapClient portal={getPortalContent()} />;
}
