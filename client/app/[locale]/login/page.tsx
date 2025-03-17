/**
 * คำอธิบาย:  
 * คอมโพเนนต์ LoginPage ใช้สำหรับการเข้าสู่ระบบ รองรับการล็อกอินด้วย username และ password  
 * มีฟังก์ชันส่งอีเมลสำหรับรีเซ็ตรหัสผ่าน และแจ้งเตือนสถานะการทำงานผ่าน Toast  
 *  
 * Input:  
 * - username: string (ชื่อผู้ใช้)  
 * - password: string (รหัสผ่าน)  
 * - rememberMe: boolean (จดจำการเข้าสู่ระบบ)  
 *  
 * Output:  
 * - ล็อกอินสำเร็จ: นำทางไปยังหน้าหลัก  
 * - ล็อกอินล้มเหลว: แสดงข้อความแจ้งเตือน  
 * - รีเซ็ตรหัสผ่าน: ส่งอีเมลแจ้งเตือน  
**/
"use client";
import { useTransition, useEffect, useState } from "react";
import lightLogo from "@/public/assets/img/system_logo_light.png";
import darkLogo from "@/public/assets/img/system_logo_dark.png";
import loginCover1 from "@/public/assets/img/login_cover_1.png";
import loginCover2 from "@/public/assets/img/login_cover_2.png";
import loginCover3 from "@/public/assets/img/login_cover_3.png";
import Image from "next/image";
import LanguageSelect from "@/components/language-select";
import ModeToggle from "@/components/mode-toggle";
import Textfield from "@/components/textfield";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { fetchData, login } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import EmblaAutoplay from "embla-carousel-autoplay";
import { useTheme } from "next-themes";
import { LoginSchema } from "@/app/type";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertCustom } from "@/components/alert-custom";

export default function LoginPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("General");
  const a = useTranslations("Alert");
  const [isPending, startTransition] = useTransition();
  const autoplayOptions = EmblaAutoplay({
    delay: 3000,
    stopOnInteraction: false,
  });
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState<string>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isConfirmAlertOpen, setIsConfirmAlertOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleInputEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleOpenAlert = () => setIsAlertOpen(true);
  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    setEmailError(null);
    setEmail(null);
  };
  const handleOpenConfirmAlert = () => setIsConfirmAlertOpen(true);
  const handleCloseConfirmAlert = () => setIsConfirmAlertOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    startTransition(async () => {
      const result = await login(values);
      if (result.accessToken && result.refreshToken) {
        toast({
          variant: "success",
          title: a("LoginSuccessTitle"),
          description: a("LoginSuccessDescription"),
        });
        router.push(`/${locale}`);
      } else if (
        result.error === "Too many login attempts, please try again later"
      ) {
        toast({
          variant: "error",
          title: a("LoginTooManyTitle"),
          description: a("LoginTooManyDescription"),
        });
      } else {
        // แสดง Toast แจ้ง Error
        toast({
          variant: "error",
          title: a("LoginErrorTitle"),
          description: a("LoginErrorDescription"),
        });
      }
    });
  }

  const sendForgotPasswordEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError(a("InvalidEmailInlineValidate"));
      toast({
        variant: "error",
        title: a("InvalidEmailTitle"),
        description: a("InvalidEmailDescription"),
      });
      return;
    }

    try {
      const response = await fetchData(
        "post",
        `/send-email-reset-password`,
        true,
        { email }
      );
      toast({
        variant: "success",
        title: a("ResetLinkCompletedTitle"),
        description: a("ResetLinkCompletedDescription"),
      });
      setEmailError(null);
      setEmail(null);
      handleCloseAlert();
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <section className="bg-card flex lg:grid lg:grid-cols-2 h-screen p-2">
      {/* แสดงรูปภาพเฉพาะจอที่มีขนาด sm ขึ้นไป */}
      <div className="bg-background hidden lg:inline w-full p-4 rounded-md">
        <Image
          className="flex items-center"
          src={resolvedTheme === "dark" ? darkLogo : lightLogo}
          alt="Logo"
          width={250}
          height={250}
          priority
        />
        <div className="flex justify-center items-center h-full">
          <Carousel plugins={[autoplayOptions]} opts={{ loop: true }}>
            <CarouselContent>
              <CarouselItem>
                <Image
                  className="flex items-center"
                  src={loginCover1}
                  alt="Cover"
                  width={1000}
                  height={1000}
                  priority
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  className="flex items-center"
                  src={loginCover2}
                  alt="Cover"
                  width={1000}
                  height={1000}
                  priority
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  className="flex items-center"
                  src={loginCover3}
                  alt="Cover"
                  width={1000}
                  height={1000}
                  priority
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* ช่องกรอก username, password ตรงกลางหน้าจอ */}
      <div className="flex flex-col w-full justify-center items-center p-4">
        <div className="flex w-full">
          <div className="lg:hidden">
            <Image
              className="absolute"
              src={resolvedTheme === "dark" ? darkLogo : lightLogo}
              alt="Logo"
              width={250}
              height={250}
              priority
            />
          </div>
          <div className="flex w-full justify-end gap-4">
            <ModeToggle />
            <LanguageSelect />
          </div>
        </div>
        <div className="gap-2 flex flex-col justify-center items-center w-full lg:w-[450px] h-full">
          <div className="flex flex-col gap-4 w-[440px]">
            <div className="flex flex-col gap-1 items-start">
              <h1 className="text-[40px] font-semibold">{t("Login")}</h1>
              <p className="text-base">{t("EnterCredentials")}</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <div className="flex flex-col gap-1 items-start">
                        <label className="text-sm font-semibold text-muted-foreground">
                          {t("Username")}
                        </label>
                        <FormControl>
                          <Textfield
                            className="bg-secondary"
                            showIcon={true}
                            iconName="person"
                            placeholder="johnDoe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <div className="flex flex-col gap-1 items-start">
                        <label className="text-sm font-semibold text-muted-foreground">
                          {t("Password")}
                        </label>
                        <FormControl>
                          <Textfield
                            className="bg-secondary"
                            type="password"
                            showIcon={true}
                            iconName="lock"
                            placeholder="verySecure"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-6 mt-6 items-center">
                  <div className="flex justify-between items-center w-full">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full h-full flex gap-2 items-center">
                            <FormControl>
                              <Checkbox
                                id="terms1"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <label
                              htmlFor="terms1"
                              className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
                            >
                              {t("RememberMe")}
                            </label>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      className="text-sm font-medium"
                      variant="link"
                      onClick={() => handleOpenAlert()}
                    >
                      {t("ForgotPassword")}
                    </Button>
                  </div>
                  <Button className="w-full" size="lg" disabled={isPending}>
                    {t("Login")}
                    <span className="material-symbols-outlined">login</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent className="sm:w-[90%] xl:w-[60%] h-fit px-6 py-4">
          <AlertDialogHeader>
            <div className="flex flex-col justify-center items-center gap-4">
              <AlertDialogTitle className="flex flex-col justify-center items-center text-2xl font-bold text-card-foreground">
                <Image
                  src={loginCover3} // ใช้ path จาก state
                  alt="First Image"
                  width={100}
                  height={100}
                  className="rounded-md object-fit cursor-pointer w-[250px] h-[250px]"
                  unoptimized
                />
                <p>{a("ForgotPasswordTitle")}</p>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-input">
                <p>{a("ForgotPasswordDescription")}</p>
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <div className="flex flex-col">
            <Textfield
              name="confirmNewPassword"
              className="text-base bg-secondary"
              type="email"
              showIcon={true}
              iconName="mail"
              placeholder="supervisor@gmail.com"
              onChange={handleInputEmail}
            />

            {emailError && (
              <p className="text-sm font-light text-destructive italic mt-1">
                {emailError}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <div className="flex items-end justify-end gap-2">
              <AlertDialogCancel
                onClick={() => {
                  handleCloseAlert();
                }}
              >
                {t("Cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "primary", size: "lg" })}
                onClick={() => handleOpenConfirmAlert()}
              >
                <span className="material-symbols-outlined text-card w-[22px] h-[22px] items-center">
                  send
                </span>
                {t("Send")}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isConfirmAlertOpen && (
        <AlertCustom
          title={a("ForgotPasswordConfirmTitle")}
          description={a("ForgotPasswordConfirmDescription")}
          primaryButtonText={t("Confirm")}
          primaryIcon="check"
          secondaryButtonText={t("Cancel")}
          backResult={(backResult) => {
            if (backResult) {
              sendForgotPasswordEmail(email);
            }
            handleCloseConfirmAlert();
          }}
        />
      )}
    </section>
  );
}
