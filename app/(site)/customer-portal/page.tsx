import { CustomerPortalView } from "@/components/customer-portal-view";
import { FORTIS } from "@/lib/constants";
import { getPortalContent } from "@/lib/portal-data";

export const metadata = {
  title: `The Customer Portal | ${FORTIS.productName}`,
  description:
    "One platform for Tier 3 & 4 — roadmap, integrations, and live status.",
};

export default function CustomerPortalPage() {
  return <CustomerPortalView portal={getPortalContent()} />;
}
