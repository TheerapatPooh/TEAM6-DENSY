'use client'
import React, { use, useEffect, useRef, useState } from 'react'
import bcrypt from "bcryptjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import BadgeCustom from '@/components/badge-custom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IUser } from '@/app/type';
import { fetchData } from '@/lib/utils';
import Loading from '@/components/loading';
import { useTranslations } from 'next-intl';
import { string } from 'zod';
import { FormProvider } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { role } from "@/app/type";
import { AlertCustom } from '@/components/alert-custom';


export default function page() {
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [ageError, setAgeError] = useState<string | null>(null);
    const [telError, setTelError] = useState<string | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [currentPassError, setCurrentPassError] = useState<string | null>(null);
    const [newPassError, setNewPassError] = useState<string | null>(null);
    const [confirmPassError, setConfirmPassError] = useState<string | null>(null);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isProfileImageDialogOpen, setIsProfileImageDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [imageProfile, setImageProfile] = useState<File | null>(null);
    const [userData, setUserData] = useState<IUser>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        tel: '',
        address: '',
        image: '',
        username: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        setMounted(true)
    }, [])
    
    const z = useTranslations("Zone")
    const a = useTranslations("Alert")
    const t = useTranslations("General");
    const getUserData = async () => {
        try {
            const data = await fetchData("get", "/user?profile=true&image=true&password=true", true);
            setUserData(data);
            setFormData({
                name: data.profile.name || '',
                email: data.email || '',
                age: data.profile.age ? String(data.profile.age) : '',
                tel: data.profile.tel || '',
                address: data.profile.address || '',
                image: data.profile.image || '',
                username: data.username || '',
                password: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error("Failed to fetch user data: ", error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []); // Empty dependency array means this will only run once, when the component mounts.


    if (!userData) {
        return <Loading />;
    }

    const handleOpenDialog = (dialogType: String) => {
        if (dialogType === "SaveProfileDialog") {
            setIsProfileDialogOpen(true);
        } else if (dialogType === "SaveProfileImageDialog") {
            setIsProfileImageDialogOpen(true);
        }
    };

    const handleDialogResult = (result: boolean) => {
        setIsProfileDialogOpen(false);
        setIsProfileImageDialogOpen(false);
        if (result && pendingAction) {
          pendingAction(); // Execute the pending action
          setPendingAction(null); // Clear the pending action
        }
    };

    const handleSaveProfile = () => {
        setPendingAction(() => () => handleUpdateUserData());
        handleOpenDialog("SaveProfileDialog");
    };

    const handleSaveProfileImage = () => {
        setPendingAction(() => () => handleUpdateImageProfile());
        handleOpenDialog("SaveProfileImageDialog");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const active: boolean = userData.active;

    const handleUpdateUserData = async () => {
        const passwordMatch = await bcrypt.compare(formData.password, userData.password);
        let showErrorToast = false;

        if (formData.password !== '' || (!formData.password !== null && passwordMatch !== false)) {
            if (!passwordMatch) {
                setCurrentPassError(a("ProfileCurrentPassInvalid"));
                showErrorToast = true;
            } else {
                setCurrentPassError(null);
            }
        } else if (!formData.password.trim()) {
            setCurrentPassError(a("ProfileCurrentPassRequire"));
            showErrorToast = true;
        }

        if (formData.newPassword != formData.confirmPassword) {
            setConfirmPassError(a("ProfileConfirmPassInvalid"));
            if (formData.newPassword.trim()) {
                setNewPassError(null);
                if (!formData.confirmPassword.trim()) {
                    setConfirmPassError(a("ProfileConfrimPassRequire"));
                }
            } else if (formData.confirmPassword.trim()) {
                setConfirmPassError(null);
                if (!formData.newPassword.trim()) {
                    setNewPassError(a("ProfileNewPassRequire"));
                }
            }
            showErrorToast = true;
        }

        if (!formData.name.trim()) {
            setNameError(a("ProfileNameRequire"));
            showErrorToast = true;
        } else {
            setNameError(null);
        }

        if (formData.email.trim() && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            setEmailError(a("ProfileEmailInvalid"));
            showErrorToast = true;
        } else {
            setEmailError(null);
        }

        if (!formData.age.trim()) {
            setAgeError(a("ProfileAgeRequire"));
            showErrorToast = true;
        } else {
            setAgeError(null);
        }

        if (!formData.age.trim()) {
            setAgeError(a("ProfileAgeRequire"));
            showErrorToast = true;
        } else if (formData.age.trim() && !/^\d+$/.test(formData.age)) {
            setAgeError(a("ProfileAgeInvalid"));
            showErrorToast = true;
        } else {
            setAgeError(null);
        }

        if (!formData.tel.trim()) {
            setTelError(a("ProfileTelRequire"));
            showErrorToast = true;
        } else if (formData.tel.trim() && !/^[0-9]{10}$/.test(formData.tel)) {
            setTelError(a("ProfileTelInvalid"));
        } else {
            setTelError(null);
        }

        if (!formData.address.trim()) {
            setAddressError(a("ProfileAddressRequire"));
            showErrorToast = true;
        } else {
            setAddressError(null);
        }

        if (showErrorToast) {
            toast({
                variant: "error",
                title: a("ProfileUpdateErrorTitle"),
                description: a("ProfileUpdateErrorDescription"),
            });
            return;
        }

        const userForm = new FormData();
        userForm.append("name", formData.name);
        userForm.append("email", formData.email);
        userForm.append("age", formData.age);
        userForm.append("tel", formData.tel);
        userForm.append("address", formData.address);
        userForm.append("username", formData.username);
        if (passwordMatch) {
            if (formData.newPassword === formData.confirmPassword) {
                userForm.append("password", formData.newPassword);
            }
        }
        userForm.append("role", userData.role);
        userForm.append("department", userData.department);
        userForm.append('active', active.toString());

        const imageForm = new FormData()
        imageForm.append("imageProfile", imageProfile)

        try {
            await fetchData("put", `/user/${userData.profile.userId}`, true, userForm)
            if (imageProfile) {
                await fetchData("put", "/profile", true, imageForm, true);
            }
            toast({
                variant: "success",
                title: a("ProfileUpdateSuccessTitle"),
                description: a("ProfileUpdateSuccessDescription"),
            });
            getUserData()
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "error",
                title: a("ProfileUpdateErrorTitle"),
                description: a("ProfileUpdateErrorDescription"),
            });
        }
    };

    const handleUpdateImageProfile = async () => {
        const imageForm = new FormData()
        imageForm.append("imageProfile", imageProfile)
        try {
            if (imageProfile) {
                await fetchData("put", "/profile", true, imageForm, true);
            }
            toast({
                variant: "success",
                title: a("ProfileImageUpdateSuccessTitle"),
                description: a("ProfileImageUpdateSuccessDescription"),
            });
            getUserData()
        } catch (error) {
            console.error("Error updating image profile:", error);
            toast({
                variant: "error",
                title: a("ProfileImageUpdateErrorTitle"),
                description: a("ProfileImageUpdateErrorDescription"),
            });
        }
    }

    const getInitials = (name: string) => {
        if (!name) return "";
        const nameParts = name.split(" ");
        return nameParts.length === 1
            ? nameParts[0].charAt(0).toUpperCase()
            : nameParts[0].charAt(0).toUpperCase() +
            nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    };

    const handleButtonClick = (event: React.FormEvent) => {
        event.preventDefault();
        document.getElementById("file-input")?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImageProfile(event.target.files[0]); // Store the new image file in state
        } else {
            setImageProfile(null); // Reset the image if no file is selected
        }
    };

    const handCancelImageProfile = () => {
        setImageProfile(null); // Reset the image if no file is selected
    }

    if (!mounted) {
        return null
    }

    return (
        <div className='flex flex-col py-4 px-6'>

            <div className='text-2xl font-bold mb-4'>
                View Profile
            </div>

            {/* first block */}
            <div className='flex justify-between px-6 py-4 bg-card mb-4'>
                <div className='flex flex-row'>
                    {userData.profile ? (
                        <Avatar className='h-32 w-32 mr-6'>
                            <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${userData.profile.image?.path}`} />
                            <AvatarFallback>
                                <p className='text-4xl'>
                                    {getInitials(userData.profile.name)}
                                </p>
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <Skeleton className="h-12 w-12 rounded-full" />
                    )}

                    <div className='flex flex-col justify-center items-start'>
                        <div className='text-2xl font-bold py-4'>
                            Welcome back, {userData.profile.name}
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button variant='outline' size='default'>
                                    Upload new photo
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className='w-[400px] h-fit' >
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-semibold">
                                        Profile Image
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="flex items-start justify-start text-lg text-input">
                                        Upload a new image for your profile.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>


                                <div className='flex gap-2'>
                                    <div>
                                        <input name='image' id="file-input" placeholder={null} type="file" className='hidden' onChange={handleFileChange} />
                                        <Button className='flex justify-center items-center w-10 h-10' variant='primary' onClick={handleButtonClick}>
                                            <span className="material-symbols-outlined text-2xl">
                                                download
                                            </span>
                                        </Button>
                                    </div>

                                </div>

                                <div className='flex justify-center items-center mb-2'>
                                    {imageProfile ? (
                                        <Avatar className='h-80 w-80'>
                                            <AvatarImage src={URL.createObjectURL(imageProfile)} />
                                            <AvatarFallback>
                                                <p className='text-4xl'>
                                                    {getInitials(formData.name)}
                                                </p>
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <Avatar className='h-80 w-80'>
                                            <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${userData.profile.image?.path}`} />
                                            <AvatarFallback>
                                                <p className='text-4xl'>
                                                    {getInitials(formData.name)}
                                                </p>
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>

                                <AlertDialogFooter>
                                    <div className="flex items-end justify-end gap-2">
                                        <AlertDialogCancel onClick={handCancelImageProfile}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className={`bg-primary hover:bg-primary/70 
                ${!imageProfile ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={handleSaveProfileImage}
                                            disabled={!imageProfile ? true : false}
                                        >
                                            <span className="material-symbols-outlined text-2xl">
                                                save
                                            </span>
                                            Send
                                        </AlertDialogAction>
                                    </div>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                    </div>
                </div>

                <div className='flex flex-col items-end justify-between'>
                    <BadgeCustom
                        variant={userData.role === "supervisor" ? "yellow" : userData.role === "inspector" ? "red" : "blue"}
                        showIcon={true}
                        shape='square'
                        iconName={userData.role === "supervisor" ? "engineering" : userData.role === "inspector" ? "person_search" : "manage_accounts"}
                    >
                        {userData.role}
                    </BadgeCustom>

                    {userData.zone ?
                        <div className='w-72'>
                            <div className='px-6 py-4 bg-secondary h-14 flex justify-center items-center rounded-lg'>
                                <div className='flex flex-row items-center'>
                                    <span className="material-symbols-outlined text-[22px] pr-1">
                                        location_on
                                    </span>
                                    <div className='pr-2'>
                                        Zone
                                    </div>
                                    <div className='text-center'>
                                        {z(userData.zone.name)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null}


                </div>
            </div>

            {/* second block */}
            <div className='flex flex-col bg-card py-4 px-6'>
                <div className='flex flex-row justify-between'>
                    {/* edit profile */}
                    <div className='flex flex-col w-full'>
                        <div className='text-2xl font-bold mb-4'>
                            Edit Profile
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>Name</p>
                            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder={userData.profile.name ? userData.profile.name : "-"} className='text-xl font-normal bg-secondary'></Input>
                            {nameError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{nameError}</p>
                            )}
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>Email</p>
                            <Input name="email" value={formData.email} onChange={handleInputChange} placeholder={userData.email ? userData.email : "-"} className='text-xl font-normal bg-secondary'></Input>
                            {emailError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{emailError}</p>
                            )}
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>Age</p>
                            <Input name="age" value={formData.age} onChange={handleInputChange} placeholder={String(userData.profile.age) ? String(userData.profile.age) : "-"} className='text-xl font-normal bg-secondary'></Input>
                            {ageError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{ageError}</p>
                            )}
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>tel</p>
                            <Input name="tel" value={formData.tel} onChange={handleInputChange} placeholder={userData.profile.tel ? userData.profile.tel : "-"} className='text-xl font-normal bg-secondary'></Input>
                            {telError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{telError}</p>
                            )}
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>Address</p>
                            <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder={userData.profile.address ? userData.profile.address : "-"} className='text-xl font-normal bg-secondary h-56'></Textarea>
                            {addressError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{addressError}</p>
                            )}
                        </div>

                    </div>

                    {/* manage account */}
                    <div className='flex flex-col w-full'>
                        <div className='text-2xl font-bold mb-4'>
                            Manage Account
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>Username</p>
                            <Input name="username" value={formData.username} onChange={handleInputChange} placeholder={userData.username ? userData.username : "-"} className='text-xl font-normal bg-secondary' readOnly></Input>
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>Current Password</p>
                            <Input type='password' name="password" placeholder='' className='text-xl font-normal bg-secondary' onChange={handleInputChange}></Input>
                            {currentPassError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{currentPassError}</p>
                            )}
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>New Password</p>
                            <Input type='password' name="newPassword" value={formData.newPassword} placeholder='' className='text-xl font-normal bg-secondary' onChange={handleInputChange}></Input>
                            {newPassError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{newPassError}</p>
                            )}
                        </div>

                        <div className='w-[415px] mb-4'>
                            <p className='text-base font-semibold text-muted-foreground mb-1'>Confirm Password</p>
                            <Input type='password' name="confirmPassword" value={formData.confirmPassword} placeholder='' className='text-xl font-normal bg-secondary' onChange={handleInputChange}></Input>
                            {confirmPassError && (
                                <p className="ttext-sm font-light text-destructive italic mt-1">{confirmPassError}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Button Back And Save    */}
                <div className='flex justify-end items-end gap-2'>
                    <Button variant='secondary'>Back</Button>
                    <Button variant='primary' onClick={handleSaveProfile}>Save</Button>
                </div>
            </div>
            {isProfileDialogOpen && (
                <AlertCustom
                    title={a("ProfileUpdateConfirmTitle")}
                    description={a("ProfileUpdateConfirmDescription")}
                    primaryButtonText={t("Confirm")}
                    primaryIcon="check"
                    secondaryButtonText={t("Cancel")}
                    backResult={handleDialogResult}
                ></AlertCustom>
            )}
            {isProfileImageDialogOpen && (
                <AlertCustom
                    title={a("ProfileImageUpdateConfirmTitle")}
                    description={a("ProfileImageUpdateConfirmDescription")}
                    primaryButtonText={t("Confirm")}
                    primaryIcon="check"
                    secondaryButtonText={t("Cancel")}
                    backResult={handleDialogResult}
                ></AlertCustom>
            )}
        </div >
    )
}
