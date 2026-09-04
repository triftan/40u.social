import { describe, expect, it } from "vitest";

describe("Supabase configuration", () => {
  it("accepts the configured public project credentials", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(url).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/);
    expect(anonKey).toBeTruthy();

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: anonKey!,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    expect(response.ok).toBe(true);
    const settings = await response.json();
    expect(settings).toHaveProperty("disable_signup");
  }, 15_000);
});
