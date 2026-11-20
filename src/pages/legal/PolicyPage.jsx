import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import "./policy.css";
import PolicyAndConditionsCard from "../../components/policyAndConditions/PolicyAndConditionsCard";
import { getPolicies, getPolicyCategories, legacyPolicySlugs } from "../../services/policyApi";

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
};

export default function PolicyPage() {
  const { policySlug } = useParams();
  const categorySlug = legacyPolicySlugs[policySlug] || policySlug;
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getPolicyCategories(), getPolicies()]).then(
      ([categories, policies]) => {
        const category = categories.find((item) => item.slug === categorySlug);
        const matches = category ? policies.filter(
          (policy) => String(policy.policy_category_id) === String(category.id),
        ) : [];
        if (active) setResult({ slug: categorySlug, policies: matches, error: false });
      },
      () => {
        if (active) setResult({ slug: categorySlug, policies: [], error: true });
      },
    );
    return () => { active = false; };
  }, [categorySlug, attempt]);

  if (!result || result.slug !== categorySlug) {
    return <div className="py-16 text-center" role="status">Loading policy...</div>;
  }

  if (result.error) {
    return <div className="py-16 text-center" role="alert">
      <p>Unable to load this policy. Please try again.</p>
      <button className="mt-4 text-sky-700 underline" onClick={() => {
        setResult(null);
        setAttempt((value) => value + 1);
      }}>Try again</button>
    </div>;
  }

  if (!result.policies.length) {
    return <div className="py-16 text-center" role="status">This policy is not available yet.</div>;
  }

  return result.policies.map((policy) => (
    <PolicyAndConditionsCard
      key={policy.id}
      title={policy.name.toUpperCase()}
      lastUpdated={formatDate(policy.date)}
      image={policy.image_url || policy.image}
      html={DOMPurify.sanitize(policy.description || "")}
    />
  ));
}
