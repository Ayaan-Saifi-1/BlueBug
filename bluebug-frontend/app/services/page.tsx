import { fetchServices } from "@/lib/api";
import { SERVICES_FALLBACK } from "@/lib/config";
import Link from "next/link";

export const metadata = {
  title: "Services",
  description: "BlueBug builds custom websites, apps, PWAs, AI/ML solutions, data pipelines, and institutional systems.",
};

export default async function ServicesPage() {
  const services = await fetchServices();
  const display = services.length ? services : SERVICES_FALLBACK;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label">What we do</span>
          <h1>Services</h1>
          <p>From a single landing page to a full AI pipeline — scoped, built, and shipped.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {display.map((s) => (
            <div key={s.slug} id={s.slug} className="service-detail-block">
              <h2>{s.title}</h2>
              <div className="service-detail-short">{s.short_description}</div>
              {(s as any).full_description && (
                <div className="service-detail-full"
                  dangerouslySetInnerHTML={{ __html: (s as any).full_description }} />
              )}
              {(s as any).proof_project && (
                <Link href="/work" className="btn btn-glass btn-sm" style={{ marginTop: "1rem" }}>
                  See it in production
                </Link>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="cta-section">
            <h2>Not sure which service fits?</h2>
            <p>Book a free 30-minute call and we&apos;ll figure it out together.</p>
            <Link href="/contact" className="btn btn-primary btn-lg">Book a Call</Link>
          </div>
        </div>
      </div>
    </>
  );
}
