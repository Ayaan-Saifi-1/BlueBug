"use client";
import { useState } from "react";
import { submitLead } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/config";

const SERVICES = [
  { value: "web",         label: "Custom Website" },
  { value: "app",         label: "Custom App" },
  { value: "pwa",         label: "Progressive Web App" },
  { value: "ai_ml",       label: "AI / ML Solution" },
  { value: "data",        label: "Data Engineering" },
  { value: "healthcare",  label: "Healthcare System" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", interested_service: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrMsg("");
    const res = await submitLead({ ...form, source_page: "contact_page" });
    if (res.success) {
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "", interested_service: "" });
    } else {
      setStatus("error");
      setErrMsg(res.error ?? `Something went wrong. Email us at ${SITE_CONFIG.email}`);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label">Contact</span>
          <h1>Start a Project</h1>
          <p>Tell us what you&apos;re building. We&apos;ll get back within 24 hours.</p>
        </div>
      </div>

      <div className="container contact-wrap" style={{ paddingBottom: "5rem" }}>
        <div className="contact-grid">
          {/* Left — Calendly + direct */}
          <div className="contact-block">
            <h2>Book a Call</h2>
            {/* Drop your Calendly inline embed below */}
            <div className="calendly-ph">
              Calendly scheduling embed goes here.<br />
              <span style={{ opacity: 0.6 }}>Founders will add before launch.</span>
            </div>
            <div className="contact-alt-links">
              <a href={`mailto:${SITE_CONFIG.email}`} className="btn btn-glass" style={{ justifyContent: "flex-start" }}>
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="contact-block">
            <h2>Send a Message</h2>

            {status === "success" ? (
              <div className="msg-success">
                <h3>Message received.</h3>
                <p>We&apos;ll be in touch within 24 hours.</p>
                <button onClick={() => setStatus("idle")} className="btn btn-glass btn-sm" style={{ marginTop: "1rem" }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name *</label>
                  <input id="name" name="name" type="text" required className="form-input"
                    value={form.name} onChange={onChange} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" required className="form-input"
                    value={form.email} onChange={onChange} placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone (optional)</label>
                  <input id="phone" name="phone" type="tel" className="form-input"
                    value={form.phone} onChange={onChange} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="interested_service">Service</label>
                  <select id="interested_service" name="interested_service" className="form-input"
                    value={form.interested_service} onChange={onChange}>
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Project Brief *</label>
                  <textarea id="message" name="message" required className="form-input"
                    value={form.message} onChange={onChange}
                    placeholder="Describe what you need built…" rows={5} minLength={10} />
                </div>
                {status === "error" && <div className="msg-error">{errMsg}</div>}
                <button type="submit" className="btn btn-primary form-submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
