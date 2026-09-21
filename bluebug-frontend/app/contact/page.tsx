"use client";
import { useState } from "react";
import { submitLead } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/config";
import { SubpageCanvas } from "@/components/ui/SubpageCanvas";
import { GlassCard } from "@/components/ui/GlassCard";
import { LottieIcon } from "@/components/ui/LottieIcon";
import { CHECK_ANIMATION } from "@/lib/lottie-animations";

const SERVICES = [
  { value: "web",        label: "Custom Website" },
  { value: "app",        label: "Custom App" },
  { value: "pwa",        label: "Progressive Web App" },
  { value: "ai_ml",      label: "AI / ML Solution" },
  { value: "data",       label: "Data Engineering" },
  { value: "healthcare", label: "Healthcare System" },
];

function CalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="20" height="20" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="20" height="20" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

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
      {/* Page header with Three.js canvas */}
      <div className="subpage-header">
        <SubpageCanvas />
        <div className="container subpage-header-inner">
          <span className="label">Contact</span>
          <h1 className="gradient-text">Start a Project</h1>
          <p>Tell us what you are building. We will get back within 24 hours.</p>
        </div>
      </div>

      <div className="container contact-wrap-v2" style={{ paddingBottom: "5rem" }}>
        <div className="contact-grid-v2">

          {/* Left — info + links */}
          <div className="contact-info-col">
            <GlassCard className="contact-info-card">
              <h2 className="contact-info-heading">Book a Call</h2>
              <p className="contact-info-sub">30-minute strategy session — free, no commitment.</p>

              <div className="contact-info-item">
                <CalIcon />
                <span>Calendly Embed — Coming Soon</span>
              </div>

              <div className="contact-divider" />

              <a href={`mailto:${SITE_CONFIG.email}`} className="contact-info-item contact-info-link" data-cursor-attract="true">
                <MailIcon />
                <span>{SITE_CONFIG.email}</span>
              </a>
            </GlassCard>

            <GlassCard className="contact-meta-card">
              <div className="contact-meta-item">
                <span className="contact-meta-label">Response Time</span>
                <span className="contact-meta-value">Within 24 hours</span>
              </div>
              <div className="contact-meta-item">
                <span className="contact-meta-label">Timezone</span>
                <span className="contact-meta-value">IST (UTC+5:30)</span>
              </div>
              <div className="contact-meta-item" style={{ borderBottom: "none" }}>
                <span className="contact-meta-label">Availability</span>
                <span className="contact-meta-value" style={{ color: "var(--bb-green)" }}>Taking Projects</span>
              </div>
            </GlassCard>
          </div>

          {/* Right — form */}
          <GlassCard className="contact-form-card">
            <h2 className="contact-form-heading">Send a Message</h2>

            {status === "success" ? (
              <div className="msg-success">
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <LottieIcon animationData={CHECK_ANIMATION} size={64} autoplay loop={false} playOnHover={false} />
                </div>
                <h3>Message received.</h3>
                <p>We will be in touch within 24 hours.</p>
                <button onClick={() => setStatus("idle")} className="btn btn-glass btn-sm" style={{ marginTop: "1rem" }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="contact-form-v2">
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Name *</label>
                    <input id="contact-name" name="name" type="text" required className="form-input" value={form.name} onChange={onChange} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email *</label>
                    <input id="contact-email" name="email" type="email" required className="form-input" value={form.email} onChange={onChange} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-phone">Phone (optional)</label>
                    <input id="contact-phone" name="phone" type="tel" className="form-input" value={form.phone} onChange={onChange} placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-service">Service</label>
                    <select id="contact-service" name="interested_service" className="form-input" value={form.interested_service} onChange={onChange}>
                      <option value="">Select a service...</option>
                      {SERVICES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Project Brief *</label>
                  <textarea id="contact-message" name="message" required className="form-input" value={form.message} onChange={onChange} placeholder="Describe what you need built..." rows={5} minLength={10} />
                </div>

                {status === "error" && <div className="msg-error">{errMsg}</div>}

                <button type="submit" id="contact-submit" className="btn btn-primary form-submit" disabled={status === "submitting"} data-cursor-attract="true">
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </>
  );
}
