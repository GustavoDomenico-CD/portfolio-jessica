// ─── Domain Types ────────────────────────────────────────────────────────────

export interface NavLink {
  href: string;
  label: string;
}

// ─── Observer / Animation ────────────────────────────────────────────────────

export interface ObserverConfig {
  threshold?: number;
  rootMargin?: string;
  observeMultiple?: boolean;
}

// ─── TypeWriter ───────────────────────────────────────────────────────────────

export interface TypeWriterOptions {
  speed?: number;
  onComplete?: () => void;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface CloudinarySource {
  src: string;
  isMobile: boolean;
}
