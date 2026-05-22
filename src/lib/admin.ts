const fallbackSuperAdminEmail = "anikareyes264@gmail.com";

export function isSuperAdminEmail(email: string | null | undefined) {
    const superAdminEmail =
        process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || fallbackSuperAdminEmail;

    return email?.toLowerCase() === superAdminEmail.toLowerCase();
}
