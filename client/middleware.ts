import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { jwtDecode } from "jwt-decode";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "th"],
  defaultLocale: "en",
});

export function middleware(req: NextRequest) {
  const currentPathname = req.nextUrl.pathname
  const response = intlMiddleware(req)
  const localeMatch = currentPathname.match(/^\/(en|th)(\/|$)/)
  const locale = localeMatch ? localeMatch[1] : 'en'

  if (currentPathname.startsWith(`/${locale}/refresh`)) {
    return response;
  }

  const authToken = req.cookies.get("authToken")?.value
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isLoginPage = req.nextUrl.pathname === `/${locale}/login`
  const isProfilePage = currentPathname.startsWith(`/${locale}/profile`);
  const isForgotPasswordPage = currentPathname.startsWith(`/${locale}/login/forgot-password`)

  if (isForgotPasswordPage) {
    return response;
  }

  if (!authToken && !refreshToken && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
  }

  if (!authToken && refreshToken) {
    return NextResponse.redirect(new URL(`/${locale}/refresh`, req.url));
  }

  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }
  // ถ้ามี token ให้ถอดรหัสและเช็ค role
  if (authToken) {
    try {
      const decodedToken: any = jwtDecode(authToken); // ถอดรหัส token
      const userRole = decodedToken.role; // ดึง role จาก token

      // อนุญาตทุก role เข้าถึง /profile
      if (isProfilePage) {
        return response;
      }

      if (userRole === "admin" && !currentPathname.startsWith(`/${locale}/admin`)) {
        return NextResponse.redirect(new URL(`/${locale}/admin/dashboard/overview`, req.url));
      }

      if (userRole === "inspector" && !currentPathname.startsWith(`/${locale}/patrol`)) {
        return NextResponse.redirect(new URL(`/${locale}/patrol`, req.url));
      }

      if (userRole === "supervisor" && !currentPathname.startsWith(`/${locale}/defect`) && !currentPathname.startsWith(`/${locale}/comment`)) {
        return NextResponse.redirect(new URL(`/${locale}/defect`, req.url));
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
