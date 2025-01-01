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


    export default function page() {
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
        const z = useTranslations("Zone")
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

        

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const active: boolean = userData.active;

        console.log("imageProfile", imageProfile)

        const handleUpdateUserData = async () => {
            const passwordMatch = await bcrypt.compare(formData.password, userData.password);

            if (formData.password !== '' || !formData.password !== null && passwordMatch !== false) {
                console.log("formData.password", formData.password)
                console.log("userData.password", userData.password)
                console.log("passwordMatch", passwordMatch)
                if (!passwordMatch) {
                    alert("Current Password do not match.")
                    return
                }
            }

            if (formData.newPassword != formData.confirmPassword) {
                alert("Passwords do not match. Please try again.");
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
                alert("Profile updated successfully!");
                getUserData()
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Failed to update profile.");
            }
        };

        const handleUpdateImageProfile = async () => {
            const imageForm = new FormData()
            imageForm.append("imageProfile", imageProfile)
            try {
                if (imageProfile) {
                    await fetchData("put", "/profile", true, imageForm, true);
                }
                alert("Image profile updated successfully!");
                getUserData()
            } catch (error) {
                console.error("Error updating image profile:", error);
                alert("Failed to update image profile.");
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

        console.log("formData", formData)

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
                                    {getInitials(userData.profile.name)}
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
                                            <input name='image' id="file-input" type="file" style={{ display: "none" }} onChange={handleFileChange} />
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
                                                    {getInitials(formData.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <Avatar className='h-80 w-80'>
                                                <AvatarImage src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${userData.profile.image?.path}`} />
                                                <AvatarFallback>
                                                    {getInitials(formData.name)}
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
                                                onClick={handleUpdateImageProfile}
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

                    <div className='flex flex-col relative'>
                        <div className='absolute top-0 right-0 capitalize'>
                            <BadgeCustom
                                variant={userData.role === "supervisor" ? "yellow" : userData.role === "inspector" ? "red" : "blue"}
                                showIcon={true}
                                shape='square'
                                iconName={userData.role === "supervisor" ? "engineering" : userData.role === "inspector" ? "person_search" : "manage_accounts"}
                            >
                                {userData.role}
                            </BadgeCustom>
                        </div>

                        <div className='absolute bottom-0 right-0 w-72'>
                            <div className='px-6 py-4 bg-secondary h-14 flex justify-center items-center rounded-lg'>
                                <div className='flex flex-row items-center'>
                                    <span className="material-symbols-outlined text-[22px] pr-1">
                                        location_on
                                    </span>
                                    <div className='pr-2'>
                                        Zone
                                    </div>
                                    <div className='text-center'>
                                        {userData.zone ? z(userData.zone.name) : "Zone not available"}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder={userData.profile.name ? userData.profile.name : "-"} className='text-xl font-normal bg-input'></Input>
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>Email</p>
                                <Input name="email" value={formData.email} onChange={handleInputChange} placeholder={userData.email ? userData.email : "-"} className='text-xl font-normal bg-input'></Input>
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>Age</p>
                                <Input name="age" value={formData.age} onChange={handleInputChange} placeholder={String(userData.profile.age) ? String(userData.profile.age) : "-"} className='text-xl font-normal bg-input'></Input>
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>tel</p>
                                <Input name="tel" value={formData.tel} onChange={handleInputChange} placeholder={userData.profile.tel ? userData.profile.tel : "-"} className='text-xl font-normal bg-input'></Input>
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>Address</p>
                                <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder={userData.profile.address ? userData.profile.address : "-"} className='text-xl font-normal bg-input h-56'></Textarea>
                            </div>

                        </div>

                        {/* manage account */}
                        <div className='flex flex-col w-full'>
                            <div className='text-2xl font-bold mb-4'>
                                Manage Account
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>Username</p>
                                <Input name="username" value={formData.username} onChange={handleInputChange} placeholder={userData.username ? userData.username : "-"} className='text-xl font-normal bg-input' readOnly></Input>
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>Current Password</p>
                                <Input type='password' name="password" placeholder='' className='text-xl font-normal bg-input' onChange={handleInputChange}></Input>
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>New Password</p>
                                <Input type='password' name="newPassword" value={formData.newPassword} placeholder='' className='text-xl font-normal bg-input' onChange={handleInputChange}></Input>
                            </div>

                            <div className='w-[415px] mb-4'>
                                <p className='text-base font-semibold text-muted-foreground mb-1'>Confirm Password</p>
                                <Input type='password' name="confirmPassword" value={formData.confirmPassword} placeholder='' className='text-xl font-normal bg-input' onChange={handleInputChange}></Input>
                            </div>
                        </div>
                    </div>

                    {/* Button Back And Save    */}
                    <div className='flex justify-end items-end gap-2'>
                        <Button variant='secondary'>Back</Button>
                        <Button variant='primary' onClick={handleUpdateUserData}>Save</Button>
                    </div>
                </div>
            </div >
        )
    }
