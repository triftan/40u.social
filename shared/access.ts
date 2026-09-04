export const ADMIN_EMAIL = "triftan88@gmail.com";

export function is40UAdmin(email: string | null | undefined) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}
