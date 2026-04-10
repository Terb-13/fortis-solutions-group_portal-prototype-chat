import faqsData from "@/data/faqs.json";

export type FaqItem = (typeof faqsData)[number];

export function getFaqs(): FaqItem[] {
  return faqsData;
}
