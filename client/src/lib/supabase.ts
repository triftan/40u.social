import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export type EventCategory =
  | "social"
  | "sports"
  | "reading"
  | "yoga"
  | "workshop"
  | "art"
  | "movie"
  | "coffee"
  | "hangout";

export type EventRow = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  city: string;
  country: string;
  venue: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  published: boolean;
  archived: boolean;
};

export type RegistrationRow = {
  id: string;
  event_id: string;
  user_id: string;
  name: string;
  email: string;
  birthday_month: number;
  birthday_day: number;
  created_at: string;
  events?: EventRow | null;
};

export const categoryLabels: Record<EventCategory, string> = {
  social: "Social",
  sports: "Sports",
  reading: "Reading",
  yoga: "Yoga",
  workshop: "Workshop",
  art: "Art",
  movie: "Movie",
  coffee: "Coffee",
  hangout: "Casual hangout",
};

export const categoryEmoji: Record<EventCategory, string> = {
  social: "✦",
  sports: "↗",
  reading: "◐",
  yoga: "∿",
  workshop: "⌘",
  art: "✎",
  movie: "◉",
  coffee: "☕",
  hangout: "☼",
};
