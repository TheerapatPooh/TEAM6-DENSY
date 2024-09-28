import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { jwtDecode } from "jwt-decode";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "th"],
  defaultLocale: "en",
});

export function middleware(req: NextRequest) {
  const response = intlMiddleware(req)
  const authToken = req.cookies.get("authToken")?.value
  const currentPathname = req.nextUrl.pathname
  const localeMatch = currentPathname.match(/^\/(en|th)(\/|$)/)
  const locale = localeMatch ? localeMatch[1] : 'en'
  const isLoginPage = req.nextUrl.pathname === `/${locale}/login`
  if (!authToken && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
  }
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }
  // ถ้ามี token ให้ถอดรหัสและเช็ค role
  if (authToken) {
    try {
      const decodedToken: any = jwtDecode(authToken); // ถอดรหัส token
      const userRole = decodedToken.role; // ดึง role จาก token
      console.log(userRole)

      if (userRole === "ADMIN" && !currentPathname.startsWith(`/${locale}/admin`)) {
        return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
      }

      if (userRole === "INSPECTOR" && !currentPathname.startsWith(`/${locale}/patrol`)) {
        return NextResponse.redirect(new URL(`/${locale}/patrol`, req.url));
      }

      if (userRole !== "ADMIN" && userRole !== "patrol" && !currentPathname.startsWith(`/${locale}`)) {
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
      }

    } catch (error) {
      console.error("Invalid token", error);
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  // ถ้าผู้ใช้พยายามเข้า login page แต่มี token อยู่แล้ว ให้ redirect ไปหน้าแรก
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/(th|en)/:path*"],
};
