import { api } from "../redux/baseApi";

// Keep existing bookmarks and links working when the API slug differs.
export const legacyPolicySlugs = {
  "terms-and-conditions": "terms-conditions",
  "return-and-refund-policy": "return-refund-policy",
  "shipping-and-delivery-policy": "shipping-delivery-policy",
  "your-privacy-choices-do-not-sell-or-share": "your-privacy-choices",
  "astrology-and-ai-disclaimer": "astrology-ai-disclaimer",
  "health-and-wellness-disclaimer": "health-wellness-disclaimer",
  "digital-products-and-services-terms": "digital-products-services-terms",
  "legal-notice-contact-and-accessibility-statement": "legal-notice-contact-accessibility-statement",
};

const readList = (response) => {
  if (response.data.status !== true || !Array.isArray(response.data.data)) {
    throw new Error("Unable to load policies. Please try again.");
  }
  return response.data.data;
};

let categoriesRequest;

export const getPolicyCategories = () => {
  if (!categoriesRequest) {
    categoriesRequest = api.get("/policy_categories").then(readList).then(
      (categories) => [...categories].sort((a, b) => Number(a.id) - Number(b.id)),
    ).catch((error) => {
      categoriesRequest = undefined;
      throw error;
    });
  }
  return categoriesRequest;
};

export const getPolicies = () => api.get("/policies").then(readList);
