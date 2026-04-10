import productsData from "@/data/products.json";
import faqsData from "@/data/faqs.json";

export type Product = (typeof productsData)[number];
export type Faq = (typeof faqsData)[number];

export function getProducts(): Product[] {
  return productsData;
}

export function getProductById(id: string): Product | undefined {
  return productsData.find((p) => p.id === id);
}

export function getFaqs(): Faq[] {
  return faqsData;
}
