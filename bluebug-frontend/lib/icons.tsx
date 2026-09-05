/**
 * Shared icon set using Lucide React — one import, consistent stroke weight.
 * Never use emojis in the UI. Use these SVG components instead.
 */

import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Smartphone,
  Zap,
  BrainCircuit,
  Database,
  Building2,
  ChevronLeft,
} from "lucide-react";

export {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Smartphone,
  Zap,
  BrainCircuit,
  Database,
  Building2,
  ChevronLeft,
};

/** One icon per service slug — edit here to change service icons globally */
export const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "custom-websites":      <Globe strokeWidth={1.5} size={20} />,
  "custom-apps":          <Smartphone strokeWidth={1.5} size={20} />,
  "progressive-web-apps": <Zap strokeWidth={1.5} size={20} />,
  "ai-ml-solutions":      <BrainCircuit strokeWidth={1.5} size={20} />,
  "data-engineering":     <Database strokeWidth={1.5} size={20} />,
  "institutional-systems":<Building2 strokeWidth={1.5} size={20} />,
};
