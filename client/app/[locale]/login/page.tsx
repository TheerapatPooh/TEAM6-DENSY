// app/login/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import lightLogo from "/app/img/system_logo_light.png"
import darkLogo from "/app/img/system_logo_dark.png"
import loginCover from "/app/img/login_cover.png"
import Image from 'next/image'
import { useTheme } from 'next-themes';
import LanguageSelect from '@/components/language-select';
import ModeToggle from '@/components/mode-toggle';
import Textfield from '@/components/textfield';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from "next-intl";



export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const t = useTranslations('General')

    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) {
        return null
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            router.push('/patrol')
        } else {
            alert('Login failed')
        }
    };

    return (
        <section className="bg-card flex justify-between h-screen p-2">
            <div className="bg-background w-full rounded-md grid grid-rows-5 p-4">
                <Image
                    className="flex items-center"
                    src={theme === 'dark' ? darkLogo : lightLogo}
                    alt="Logo"
                    width={250}
                    priority
                />
                <div className="grid grid-rows-subgrid gap-4 row-span-3 justify-center items-center">
                    <Image
                        className="flex items-center row-start-2"
                        src={loginCover}
                        alt="Cover"
                        width={500}
                        height={500}
                        priority

                    />
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <div className='flex w-full justify-end gap-4'>
                    <ModeToggle />
                    <LanguageSelect />
                </div>
                <div className='gap-2 flex flex-col justify-center items-start w-[450px] h-full'>
                    <h1 className='text-5xl font-semibold'>{t('Login')}</h1>
                    <p>{t('EnterCredentials')}</p>
                    <label className='text-xl font-semibold mt-6'>{t('Username')}</label>
                    <Textfield className='bg-secondary' showIcon={true} iconName='person' placeholder='johnDoe' />
                    <label className='text-xl font-semibold mt-6'>{t('Password')}</label>
                    <Textfield className='bg-secondary' type='password' showIcon={true} iconName='lock' placeholder='verySecure' />
                    <Button size="lg" className='mt-6'>
                    {t('Login')}
                        <span className="material-symbols-outlined">
                            login
                        </span>
                    </Button>
                </div>
            </div>
        </section>
        // <form onSubmit={handleSubmit}>
        //   <input
        //     type="text"
        //     value={username}
        //     onChange={(e) => setUsername(e.target.value)}
        //     placeholder="Username"
        //     required
        //   />
        //   <input
        //     type="password"
        //     value={password}
        //     onChange={(e) => setPassword(e.target.value)}
        //     placeholder="Password"
        //     required
        //   />
        //   <button type="submit">Login</button>
        // </form>
    );
}
