/**
 * คำอธิบาย: ไฟล์นี้ใช้สำหรับการจัดการ middleware ในระบบ
 * Input: ข้อมูล request จาก client
 * Output: การจัดการ middleware ในระบบ
**/
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

  const authToken = req.cookies.get("authToken")?.value
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isLoginPage = req.nextUrl.pathname === `/${locale}/login`
  const isProfilePage = currentPathname.startsWith(`/${locale}/profile`);
  const isForgotPasswordPage = currentPathname.startsWith(`/${locale}/login/forgot-password`)
  const isRefreshPage = currentPathname.startsWith(`/${locale}/refresh`);

  // ถ้าเป็นหน้า login หรือ refresh ให้ return ไปเลย
  if (isForgotPasswordPage || isRefreshPage) {
    return response;
  }

  // ถ้าไม่มี token ให้ redirect ไปหน้า login
  if (!authToken && !refreshToken && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
  }

  // ถ้าไม่มี token แต่มี refreshToken ให้ redirect ไปหน้า refresh
  if (!authToken && refreshToken && !isRefreshPage) {
    return NextResponse.redirect(new URL(`/${locale}/refresh`, req.url));
  }

  // ถ้ามี token และเข้าหน้า login ให้ redirect ไปหน้าหลัก
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

      // ถ้า role ตรงกับ admin ให้ redirect ไปหน้าที่เกี่ยวกับ admin
      if (userRole === "admin" && !currentPathname.startsWith(`/${locale}/admin`)) {
        return NextResponse.redirect(new URL(`/${locale}/admin/dashboard/overview`, req.url));
      }

      // ถ้า role ตรงกับ inspector ให้ redirect ไปหน้าที่เกี่ยวกับ inspector
      if (userRole === "inspector" && !currentPathname.startsWith(`/${locale}/patrol`)) {
        return NextResponse.redirect(new URL(`/${locale}/patrol`, req.url));
      }

      // ถ้า role ตรงกับ supervisor ให้ redirect ไปหน้าที่เกี่ยวกับ supervisor
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
