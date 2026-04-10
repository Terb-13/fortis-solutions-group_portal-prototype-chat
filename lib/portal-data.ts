import portal from "@/data/portal-content.json";

export type TierRow = (typeof portal.tierComparison)[number];
export type RoadmapPhase = (typeof portal.roadmapPhases)[number];
export type IntegrationRow = (typeof portal.integrations)[number];
export type Milestone = (typeof portal.milestones)[number];

export function getPortalContent() {
  return portal;
}
