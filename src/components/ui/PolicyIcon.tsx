"use client";

import {
  ShieldAlert,
  Flame,
  Skull,
  Siren,
  EyeOff,
  Ban,
  MessageCircle,
  Target,
  UserX,
  Heart,
  AlertCircle,
  Link,
  Link2,
  Scale,
  Lock,
  Eye,
  Pill,
  Wine,
  Crosshair,
  Gamepad2,
  Activity,
  Package,
  Mail,
  Tag,
  Bookmark,
  MessageSquareWarning,
  FileText,
  Shield,
  LucideIcon,
} from "lucide-react";
import { PolicyId } from "@/lib/types";

// Map icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  "shield-alert": ShieldAlert,
  "flame": Flame,
  "skull": Skull,
  "siren": Siren,
  "eye-off": EyeOff,
  "ban": Ban,
  "message-circle": MessageCircle,
  "target": Target,
  "users-x": UserX,
  "heart": Heart,
  "alert-circle": AlertCircle,
  "link": Link,
  "link-2": Link2,
  "scale": Scale,
  "lock": Lock,
  "eye": Eye,
  "pill": Pill,
  "wine": Wine,
  "crosshair": Crosshair,
  "gamepad-2": Gamepad2,
  "activity": Activity,
  "package": Package,
  "mail": Mail,
  "tag": Tag,
  "bookmark": Bookmark,
  "message-square-warning": MessageSquareWarning,
  "file-text": FileText,
  "shield": Shield,
};

// Direct mapping from PolicyId to icon
const POLICY_ICON_MAP: Record<PolicyId, LucideIcon> = {
  csean: ShieldAlert,
  vi: Flame,
  vgc: Skull,
  doi: Siren,
  ansa: EyeOff,
  ase: Ban,
  sspx: MessageCircle,
  bh: Target,
  hc: UserX,
  ssied: Heart,
  cis: AlertCircle,
  he: Link,
  chpc: Link2,
  fsdp: Scale,
  cyber: Lock,
  pv: Eye,
  dp: Pill,
  ta: Wine,
  wae: Crosshair,
  ogg: Gamepad2,
  hw: Activity,
  rp: Package,
  spam: Mail,
  bcp: Tag,
  bcr: Bookmark,
  psl: MessageSquareWarning,
  orgs: FileText,
};

interface PolicyIconProps {
  /** Policy ID to get icon for */
  policyId?: PolicyId;
  /** Or use icon name directly */
  iconName?: string;
  /** CSS class for sizing/styling */
  className?: string;
  /** Icon color */
  color?: string;
}

export function PolicyIcon({ policyId, iconName, className = "w-5 h-5", color }: PolicyIconProps) {
  let IconComponent: LucideIcon = Shield; // Default fallback

  if (policyId && POLICY_ICON_MAP[policyId]) {
    IconComponent = POLICY_ICON_MAP[policyId];
  } else if (iconName && ICON_MAP[iconName]) {
    IconComponent = ICON_MAP[iconName];
  }

  return <IconComponent className={className} style={color ? { color } : undefined} />;
}

// Export the maps for direct use if needed
export { ICON_MAP, POLICY_ICON_MAP };

// Helper to get icon component by policy ID
export function getIconByPolicyId(policyId: PolicyId): LucideIcon {
  return POLICY_ICON_MAP[policyId] || Shield;
}

// Helper to get icon component by name
export function getIconByName(name: string): LucideIcon {
  return ICON_MAP[name] || Shield;
}

export default PolicyIcon;