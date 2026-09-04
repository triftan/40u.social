import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("40U Supabase policy contract", () => {
  const schema = readFileSync(resolve(process.cwd(), "supabase/schema.sql"), "utf8");

  it("keeps public visibility and admin mutations separate", () => {
    expect(schema).toContain('create policy "published events are public"');
    expect(schema).toContain('create policy "admin can create events"');
    expect(schema).toContain("public.is_40u_admin()");
  });

  it("enforces member ownership and capacity checks for registration inserts", () => {
    expect(schema).toContain('create policy "members can see their own registrations"');
    expect(schema).toContain('auth.uid() = user_id');
    expect(schema).toContain("public.event_has_capacity(event_id)");
    expect(schema).toContain("unique(event_id, user_id)");
  });

  it("does not define a birth year field", () => {
    expect(schema).not.toMatch(/birth[_ ]?year/i);
    expect(schema).toContain("birthday_month");
    expect(schema).toContain("birthday_day");
  });
});
