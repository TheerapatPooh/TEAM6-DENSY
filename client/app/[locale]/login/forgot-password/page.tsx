'use client'

import React, { useEffect, useState } from 'react'
import loginCover3 from "@/public/assets/img/login_cover_3.png"
import Image from 'next/image'
import Textfield from '@/components/textfield'
import { toast } from '@/hooks/use-toast'
import { useLocale, useTranslations } from 'next-intl'
import { fetchData } from '@/lib/utils'
import ModeToggle from '@/components/mode-toggle'
import { useTheme } from 'next-themes'
import lightLogo from "@/public/assets/img/system_logo_light.png"
import darkLogo from "@/public/assets/img/system_logo_dark.png"
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCustom } from '@/components/alert-custom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function page() {
    const t = useTranslations('General')
    const a = useTranslations("Alert");
    const [newPassword, setNewPassword] = useState<string | null>(null)
    const [confirmPassword, setConfirmPassword] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter()
    const locale = useLocale();
    const { resolvedTheme } = useTheme()

    const [newPassError, setNewPassError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const handleOpenAlert = () => setIsAlertOpen(true);
    const handleCloseAlert = () => setIsAlertOpen(false)

    const handleInputNewPassword = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { value } = e.target;
        setNewPassword(value)
    };

    const handleInputConfirmPassword = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { value } = e.target;
        setConfirmPassword(value)
    };

    const handleUpdateUserPassword = async () => {
        let showErrorToast = false;
        setNewPassError(null);
        setConfirmPasswordError(null);

        // ตรวจสอบว่ามีการกรอกรหัสผ่านใหม่หรือไม่
        if (!newPassword) {
            setNewPassError(a("ProfileNewPassRequire"));
            showErrorToast = true;
        }

        // ตรวจสอบว่ามีการกรอกยืนยันรหัสผ่านหรือไม่
        if (!confirmPassword) {
            setConfirmPasswordError(a("ProfileConfirmPassRequire"));
            showErrorToast = true;
        }

        // ตรวจสอบความยาวของรหัสผ่าน (ต้องมีอย่างน้อย 8 ตัวอักษร)
        if (newPassword && newPassword.length < 8) {
            setNewPassError(a("ProfileNewPassMinLength"));
            showErrorToast = true;
        }

        if (confirmPassword && confirmPassword.length < 8) {
            setConfirmPasswordError(a("ProfileNewPassMinLength"));
            showErrorToast = true;
        }

        // ตรวจสอบว่ารหัสผ่านใหม่และยืนยันรหัสผ่านตรงกันหรือไม่
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            setConfirmPasswordError(a("ProfileConfirmPassInvalid"));
            showErrorToast = true;
        }

        // ถ้ามีข้อผิดพลาดแสดง toast และหยุดการทำงาน
        if (showErrorToast) {
            toast({
                variant: "error",
                title: a("ProfileUpdateErrorTitle"),
                description: a("ProfileUpdateErrorDescription"),
            });
            return;
        }

        // ถ้ารหัสผ่านใหม่และยืนยันตรงกัน
        const userForm = new FormData();
        userForm.append("newPassword", newPassword);
        userForm.append("token", token)

        try {
            const response = await fetchData(
                "put",
                "/reset-password",
                true,
                userForm
            );
            if (response.status === 200) {
                setNewPassError(null);
                setConfirmPasswordError(null);

                toast({
                    variant: "success",
                    title: a("PasswordResetCompletedTitle"),
                    description: a("PasswordResetCompletedDescription"),
                });
                router.push(`/${locale}/login`);
            }

        } catch (error) {
            console.error("Error updating password:", error);
            toast({
                variant: "error",
                title: a("ProfileUpdateErrorTitle"),
                description: a("ProfileUpdateErrorDescription"),
            });
        }
    };

    const changeLanguage = (locale: string) => {
        if (mounted) {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            let newPath = `/${locale}/login/forgot-password`;
            if (token) {
                newPath += `?token=${token}`;
            }

            router.replace(newPath);
            router.refresh();
        }
    };

    const verifyToken = async (token: string) => {
        try {
            const response = await fetchData("get", `/verify-token?token=${token}`, true);

            if (response.status === "200" || response.status === 200) {
                setIsValidToken(true);
            } else {
                setIsValidToken(false);
                toast({
                    variant: "error",
                    title: (a("InvalidTokenTitle")),
                    description: (a("InvalidTokenDescription"))
                });
                router.push(`/${locale}/login`);
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            setIsValidToken(false);
            router.push(`/${locale}/login`);
        }
    };

    useEffect(() => {
        const tokenFromURL = searchParams.get('token');
        if (tokenFromURL) {
            setToken(tokenFromURL);
            verifyToken(tokenFromURL);
        } else {
            router.push(`/${locale}/login`);
        }
    }, []);

    useEffect(() => {
        changeLanguage(locale)
        setMounted(true)
    }, [])

    if (!mounted) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center w-full">
            {/* header */}
            <div className=" flex flex-col w-full justify-center items-center p-4">
                <div className="flex flex-row w-full">
                    <div onClick={() => (router.push(`/${locale}/login`))}>
                        <Image
                            className="flex items-center"
                            src={resolvedTheme === 'dark' ? darkLogo : lightLogo}
                            alt="Logo"
                            width={250}
                            height={250}
                            priority
                        />
                    </div>
                    <div className="flex w-full justify-end gap-4">
                        <ModeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant='ghost' className="w-[45px] h-[45px] text-input">
                                    <span className="material-symbols-outlined">language</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className='p-0'>
                                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                                    {t('English')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeLanguage('th')}>
                                    {t('Thai')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* second block */}
            <div className="flex flex-col justify-center items-center gap-4 flex-grow w-full h-full">
                <Image
                    src={loginCover3}
                    alt="First Image"
                    width={100}
                    height={100}
                    className="rounded-md object-cover w-[250px] h-[250px]"
                    unoptimized
                />
                <div className="text-2xl font-bold">
                    <p>{t("ResetPassword")}</p>
                </div>
                <div className="flex flex-col gap-4 lg:w-[30%] sm:w-[45%]">
                    <div className="flex flex-col gap-1 w-full">
                        <p>{t("NewPassword")}</p>
                        <Textfield
                            name="newPassword"
                            className="text-xl font-normal bg-secondary"
                            type="password"
                            showIcon={true}
                            iconName="key"
                            placeholder=""
                            onChange={handleInputNewPassword}
                        />
                        {newPassError && (
                            <p className="text-sm font-light text-destructive italic mt-1">
                                {newPassError}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <p>{t("ConfirmPassword")}</p>
                        <Textfield
                            name="confirmNewPassword"
                            className="text-xl font-normal bg-secondary"
                            type="password"
                            showIcon={true}
                            iconName="key"
                            placeholder=""
                            onChange={handleInputConfirmPassword}
                        />
                        {confirmPasswordError && (
                            <p className="text-sm font-light text-destructive italic mt-1">
                                {confirmPasswordError}
                            </p>
                        )}
                    </div>
                    <Button className='w-full' variant="default" size="lg" onClick={() => handleOpenAlert()}>{t("Reset")}</Button>
                </div>
            </div>

            {isAlertOpen && (
                <AlertCustom
                    title={a("ResetPasswordConfirmTitle")}
                    description={a("ResetPasswordConfirmDescription")}
                    primaryButtonText={t("Confirm")}
                    primaryIcon="check"
                    secondaryButtonText={t("Cancel")}
                    backResult={(backResult) => {
                        if (backResult) {
                            handleUpdateUserPassword()
                        }
                        handleCloseAlert()
                    }}
                />
            )}
        </div>
    );
}
