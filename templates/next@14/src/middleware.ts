import { routing } from "@i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);
const PROTECTED_ROUTES = ["/wishlist", "/checkout", "/profile", "/dashboard"];

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    return intlMiddleware(req);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
