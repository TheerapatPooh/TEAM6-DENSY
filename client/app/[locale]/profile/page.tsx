/**
 * คำอธิบาย:
 *   หน้า Profile ใช้สำหรับแสดงข้อมูลของผู้ใช้ และสามารถแก้ไขข้อมูลส่วนตัวได้
 *
 * Input:
 * - ไม่มี
 * Output:
 * - หน้า Profile ที่แสดงข้อมูลของผู้ใช้ และสามารถแก้ไขข้อมูลส่วนตัวได้
 * - แสดงข้อมูลของผู้ใช้ และสามารถแก้ไขข้อมูลของผู้ใช้ได้
 **/

"use client";
import bcrypt from "bcryptjs";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import BadgeCustom from "@/components/badge-custom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IUser } from "@/app/type";
import { fetchData, getInitials } from "@/lib/utils";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
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
import { toast } from "@/hooks/use-toast";
import { AlertCustom } from "@/components/alert-custom";
import Map from "@/components/map";
import Textfield from "@/components/textfield";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IFormProfile {
  name?: string;
  email?: string;
  age?: number;
  tel?: string;
  address?: string;
  image?: string;
  username?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

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
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isProfileImageDialogOpen, setIsProfileImageDialogOpen] =
    useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [imageProfile, setImageProfile] = useState<File | null>(null);
  const [userData, setUserData] = useState<IUser>(null);
  const [formData, setFormData] = useState<IFormProfile>();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    getUserData();
    setMounted(true);
  }, []);

  const z = useTranslations("Zone");
  const a = useTranslations("Alert");
  const t = useTranslations("General");

  const getUserData = async () => {
    try {
      const data = await fetchData(
        "get",
        "/user?profile=true&image=true&password=true",
        true
      );
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data: ", error);
    }
  };

  if (!mounted || !userData) {
    return <Loading />;
  }

  const handleOpenDialog = (dialogType: String) => {
    if (dialogType === "SaveProfileDialog") {
      setIsProfileDialogOpen(true);
    } else if (dialogType === "SaveProfileImageDialog") {
      setIsProfileImageDialogOpen(true);
    } else if (dialogType === "SavePasswordDialog") {
      setIsPasswordDialogOpen(true);
    }
  };

  const handleDialogResult = (result: boolean) => {
    setIsProfileDialogOpen(false);
    setIsProfileImageDialogOpen(false);
    setIsPasswordDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
    }
  };

  const handleSaveProfile = () => {
    setPendingAction(() => () => handleUpdateUserData());
    handleOpenDialog("SaveProfileDialog");
  };

  const handleChangePassword = () => {
    setPendingAction(() => () => handleUpdateUserPassword());
    handleOpenDialog("SavePasswordDialog");
  };

  const handleSaveProfileImage = () => {
    setPendingAction(() => () => handleUpdateImageProfile());
    handleOpenDialog("SaveProfileImageDialog");
    setImageProfile(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev };
      updatedFormData[name] = value;
      return updatedFormData;
    });
  };

  console.log(formData)
  const handleUpdateUserData = async () => {
    let update = false
    let showErrorToast = false;
    setCurrentPassError(null);
    setNewPassError(null);
    setConfirmPassError(null);
    setNameError(null);
    setEmailError(null);
    setAgeError(null);
    setTelError(null);
    setAddressError(null);

    const userForm = new FormData();

    // name
    if (formData?.name === null || formData?.name === '') {
      setNameError(a("ProfileNameRequire"));
      showErrorToast = true;
    } else if (formData?.name && formData?.name !== userData.profile.name) {
      userForm.append("name", formData.name);
      update = true;
    }

    //  email
    if (formData?.email === null || formData?.email === '') {
      setEmailError(a("ProfileEmailRequire"));
      showErrorToast = true;
    } else if (formData?.email && formData?.email !== userData.email) {
      if (formData?.email && formData.email.trim() && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
        userForm.append("email", formData.email);
        update = true;
      }
      else {
        setEmailError(a("ProfileEmailInvalid"));
        showErrorToast = true;
      }
    }

    //  age
    if (formData?.age !== undefined && formData?.age.toString() === '') {
      setAgeError(a("ProfileAgeRequire"));
      showErrorToast = true;
    } else if (formData?.age && formData?.age.toString() !== userData.profile?.age?.toString()) {
      if (formData?.age && !isNaN(Number(formData.age)) && Number(formData.age) <= 120 && Number(formData.age) > 0) {
        userForm.append("age", formData.age.toString());
        update = true;
      } else {
        setAgeError(a("ProfileAgeInvalid"));
        showErrorToast = true;
      }
    }

    //  tel
    if (formData?.tel === null || formData?.tel === '') {
      setTelError(a("ProfileTelRequire"));
      showErrorToast = true;
    } else if (formData?.tel && formData?.tel !== userData.profile.tel) {
      if (formData?.tel?.trim() && /^[0-9]{10}$/.test(formData.tel.trim())) {
        userForm.append("tel", formData.tel);
        update = true;
      } else {
        setTelError(a("ProfileTelInvalid"));
        showErrorToast = true;
      }
    }

    //  address
    if (formData?.address === null || formData?.address === '') {
      setAddressError(a("ProfileAddressRequire"));
      showErrorToast = true;
    } else if (formData?.address && formData?.address !== userData.profile.address) {
      userForm.append("address", formData.address);
      update = true;
    }

    if (showErrorToast) {
      toast({
        variant: "error",
        title: a("ProfileUpdateErrorTitle"),
        description: a("ProfileUpdateErrorDescription"),
      });
      return;
    }

    console.log("userform", userForm)
    if (update) {
      try {
        const response = await fetchData(
          "put",
          `/user/${userData.profile.userId}`,
          true,
          userForm
        );
        if (response) {
          setUserData(response);
          toast({
            variant: "success",
            title: a("ProfileUpdateSuccessTitle"),
            description: a("ProfileUpdateSuccessDescription"),
          });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          variant: "error",
          title: a("ProfileUpdateErrorTitle"),
          description: a("ProfileUpdateErrorDescription"),
        });
      }
    } else {
      toast({
        variant: "default",
        title: a("ProfileNoChangeTitle"),
        description: a("ProfileNoChangeDescription"),
      });
      return;
    }
  };

  const handleUpdateUserPassword = async () => {
    let showErrorToast = false;
    setCurrentPassError(null);
    setNewPassError(null);
    setConfirmPassError(null);
    setNameError(null);
    setEmailError(null);
    setAgeError(null);
    setTelError(null);
    setAddressError(null);

    // Check if all fields are filled
    if (!formData?.currentPassword) {
      setCurrentPassError(a("ProfileCurrentPassRequire"));
      showErrorToast = true;
    }

    if (!formData?.newPassword) {
      setNewPassError(a("ProfileNewPassRequire"));
      showErrorToast = true;
    }

    if (!formData?.confirmPassword) {
      setConfirmPassError(a("ProfileConfirmPassRequire"));
      showErrorToast = true;
    }

    // If there's any error, show toast and stop
    if (showErrorToast) {
      toast({
        variant: "error",
        title: a("ProfileUpdateErrorTitle"),
        description: a("ProfileUpdateErrorDescription"),
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      formData?.currentPassword,
      userData?.password
    );

    const isPasswordTheSame = await bcrypt.compare(
      formData?.newPassword,
      userData?.password
    );

    if (formData?.newPassword === formData?.confirmPassword) {
      if (!isPasswordTheSame) {
        if (passwordMatch) {
          const userForm = new FormData();
          userForm.append("password", formData.newPassword);

          try {
            const response = await fetchData(
              "put",
              `/user/${userData.profile.userId}`,
              true,
              userForm
            );
            if (response) {
              setUserData(response);
              toast({
                variant: "success",
                title: a("ProfileUpdateSuccessTitle"),
                description: a("ProfileUpdateSuccessDescription"),
              });
              try {
                await fetchData("post", `/logout`, true);
                window.location.reload();
              } catch (error) { }
            }
          } catch (error) {
            console.error("Error updating password:", error);
            showErrorToast = true;
          }
          return;
        } else {
          setCurrentPassError(a("ProfileCurrentPassInvalid"));
          toast({
            variant: "error",
            title: a("ProfileUpdateErrorTitle"),
            description: a("ProfileUpdateErrorDescription"),
          });
          return;
        }
      } else {
        toast({
          variant: "default",
          title: a("ProfileNoChangeTitle"),
          description: a("ProfileNoChangeDescription"),
        });
      }
    } else {
      setConfirmPassError(a("ProfileConfirmPassInvalid"));
      toast({
        variant: "error",
        title: a("ProfileUpdateErrorTitle"),
        description: a("ProfileUpdateErrorDescription"),
      });
      return;
    }
  };

  const handleUpdateImageProfile = async () => {
    const imageForm = new FormData();
    imageForm.append("imageProfile", imageProfile);
    try {
      if (imageProfile) {
        await fetchData("put", "/profile", true, imageForm, true);
      }
      toast({
        variant: "success",
        title: a("ProfileImageUpdateSuccessTitle"),
        description: a("ProfileImageUpdateSuccessDescription"),
      });
      getUserData();
    } catch (error) {
      console.error("Error updating image profile:", error);
      toast({
        variant: "error",
        title: a("ProfileImageUpdateErrorTitle"),
        description: a("ProfileImageUpdateErrorDescription"),
      });
    }
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
  };

  return (
    <div className="flex flex-col py-4 px-6 gap-4">
      <div className="text-2xl font-bold">{t("ViewProfile")}</div>

      {/* first block */}
      <div className="flex justify-between px-6 py-4 bg-card rounded-md custom-shadow">
        <div className="flex flex-row">
          {userData.profile ? (
            <Avatar className="h-32 w-32 mr-6">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${userData.profile.image?.path}`}
              />
              <AvatarFallback id={userData.id?.toString()}>
                <p className="text-4xl">{getInitials(userData.profile.name)}</p>
              </AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="h-12 w-12 rounded-full" />
          )}

          <div className="flex flex-col justify-center items-start">
            <div className="text-2xl font-bold py-4">
              {t("WelcomeBack")}, {userData.profile.name}
            </div>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  className="custom-shadow"
                  variant="outline"
                  size="default"
                >
                  {t("UploadNewPhoto")}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="flex flex-col px-6 py-4 w-[400px] h-fit">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-semibold">
                    {t("ProfileImage")}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="flex items-start justify-start text-base text-input">
                    {t("ProfileImageDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex gap-2">
                  <div>
                    <input
                      name="image"
                      id="file-input"
                      placeholder={null}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      className="flex justify-center items-center h-[40px] w-[40px]"
                      variant="primary"
                      onClick={handleButtonClick}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        upload
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center items-center mb-2">
                  {imageProfile ? (
                    <Avatar className="h-80 w-80">
                      <AvatarImage src={URL.createObjectURL(imageProfile)} />
                      <AvatarFallback id={userData.id.toString()}>
                        <p className="text-6xl">
                          {getInitials(userData.profile.name)}
                        </p>
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-80 w-80">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${userData.profile.image?.path}`}
                      />
                      <AvatarFallback id={userData.id.toString()}>
                        <p className="text-6xl">
                          {getInitials(userData.profile.name)}
                        </p>
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <AlertDialogFooter>
                  <div className="flex items-end justify-end gap-2">
                    <AlertDialogCancel onClick={handCancelImageProfile}>
                      {t("Cancel")}
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
                      {t("Save")}
                    </AlertDialogAction>
                  </div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <BadgeCustom
            variant={
              userData.role === "supervisor"
                ? "yellow"
                : userData.role === "inspector"
                  ? "red"
                  : "blue"
            }
            showIcon={true}
            shape="square"
            iconName={
              userData.role === "supervisor"
                ? "engineering"
                : userData.role === "inspector"
                  ? "person_search"
                  : "manage_accounts"
            }
          >
            {t(userData.role)}
          </BadgeCustom>

          {userData.zone ? (
            <AlertDialog>
              <AlertDialogTrigger className="flex justify-center items-center min-w-72 px-6 py-4 bg-secondary gap-2 rounded-md">
                <div className="flex flex-row items-center gap-1 text-muted-foreground">
                  <span className="material-symbols-outlined text-[22px] pr-1">
                    location_on
                  </span>
                  <p className="text-base font-semibold">{t("ZoneText")}</p>
                </div>
                <p>{z(userData.zone.name)}</p>
              </AlertDialogTrigger>

              <AlertDialogContent className="w-full sm:w-[40%] md:w-[50%] lg:w-[100%] max-w-[1200px] rounded-md px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    <p>{t("Zone")}</p>
                  </div>
                  <div className=" flex justify-center bg-secondary rounded-md py-4">
                    <Map
                      disable={true}
                      initialSelectedZones={[userData.zone.id]}
                    />
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogAction
                    className={buttonVariants({
                      variant: "secondary",
                      size: "lg",
                    })}
                  >
                    {t("Close")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsContent className="w-full" value="profile">
          <div className="flex flex-col bg-card w-full py-4 px-6 rounded-md custom-shadow">
            <div className="flex flex-col gap-4">
              <TabsList className="flex gap-1 bg-secondary w-[233px] h-10">
                <TabsTrigger value="profile" className="flex gap-2 w-[98px]">
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                  <div className=" font-bold">Profile</div>
                </TabsTrigger>
                <TabsTrigger value="password" className="flex gap-2 w-[119px]">
                  <span className="material-symbols-outlined">lock</span>
                  <div className=" font-bold">Password</div>
                </TabsTrigger>
              </TabsList>
              <div className="flex flex-row justify-between">
                {/* edit profile */}
                <div className="flex flex-col w-full">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="text-2xl font-bold ">
                      {t("EditProfile")}
                    </div>
                    <div>{t("EditProfileDescription")}</div>
                  </div>

                  <div className="w-[415px] mb-4">
                    <p className="text-base font-semibold text-muted-foreground mb-1">
                      {t("Name")}
                    </p>
                    <Input
                      defaultValue={
                        userData.profile.name ? userData.profile.name : "-"
                      }
                      name="name"
                      onChange={handleInputChange}
                      placeholder={
                        userData.profile.name ? userData.profile.name : "-"
                      }
                      className="text-xl font-normal bg-secondary"
                    ></Input>
                    {nameError && (
                      <p className="ttext-sm font-light text-destructive italic mt-1">
                        {nameError}
                      </p>
                    )}
                  </div>

                  <div className="w-[415px] mb-4">
                    <p className="text-base font-semibold text-muted-foreground mb-1">
                      {t("Email")}
                    </p>
                    <Input
                      defaultValue={userData.email ? userData.email : "-"}
                      name="email"
                      onChange={handleInputChange}
                      placeholder={userData.email ? userData.email : "-"}
                      className="text-xl font-normal bg-secondary"
                    ></Input>
                    {emailError && (
                      <p className="ttext-sm font-light text-destructive italic mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="w-[415px] mb-4">
                    <p className="text-base font-semibold text-muted-foreground mb-1">
                      {t("Age")}
                    </p>
                    <Input
                      defaultValue={
                        userData.profile.age ? userData.profile.age : "-"
                      }
                      name="age"
                      onChange={handleInputChange}
                      placeholder={
                        String(userData.profile.age)
                          ? String(userData.profile.age)
                          : "-"
                      }
                      className="text-xl font-normal bg-secondary"
                    ></Input>
                    {ageError && (
                      <p className="ttext-sm font-light text-destructive italic mt-1">
                        {ageError}
                      </p>
                    )}
                  </div>

                  <div className="w-[415px] mb-4">
                    <p className="text-base font-semibold text-muted-foreground mb-1">
                      {t("Tel")}
                    </p>
                    <Input
                      defaultValue={
                        userData.profile.tel ? userData.profile.tel : "-"
                      }
                      name="tel"
                      onChange={handleInputChange}
                      placeholder={
                        userData.profile.tel ? userData.profile.tel : "-"
                      }
                      className="text-xl font-normal bg-secondary"
                    ></Input>
                    {telError && (
                      <p className="ttext-sm font-light text-destructive italic mt-1">
                        {telError}
                      </p>
                    )}
                  </div>

                  <div className="w-[415px] mb-4">
                    <p className="text-base font-semibold text-muted-foreground mb-1">
                      {t("Address")}
                    </p>
                    <Textarea
                      defaultValue={
                        userData.profile.address
                          ? userData.profile.address
                          : "-"
                      }
                      name="address"
                      onChange={handleInputChange}
                      placeholder={
                        userData.profile.address
                          ? userData.profile.address
                          : "-"
                      }
                      className="text-xl font-normal bg-secondary custom-shadow h-56"
                    ></Textarea>
                    {addressError && (
                      <p className="ttext-sm font-light text-destructive italic mt-1">
                        {addressError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Button Back And Save    */}
            <div className="flex justify-end items-end gap-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push(`/${locale}/`)}
              >
                {t("Back")}
              </Button>
              <Button variant="primary" size="lg" onClick={handleSaveProfile}>
                <span className="material-symbols-outlined text-2xl">save</span>
                {t("Save")}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="w-full" value="password">
          <div className="flex  flex-col bg-card py-4 px-6 rounded-md custom-shadow">
            <div className="flex flex-col gap-4">
              <TabsList className="flex gap-1 bg-secondary w-[233px] h-10">
                <TabsTrigger value="profile" className="flex gap-2 w-[98px]">
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                  <div className=" font-bold">Profile</div>
                </TabsTrigger>
                <TabsTrigger value="password" className="flex gap-2 w-[119px]">
                  <span className="material-symbols-outlined">lock</span>
                  <div className=" font-bold">Password</div>
                </TabsTrigger>
              </TabsList>
              <div className="flex flex-row justify-between">
                {/* manage account */}
                <div className="flex flex-col w-full">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="text-2xl font-bold ">
                      {t("ManageAccount")}
                    </div>
                    <div>{t("EditPasswordDescription")}</div>
                  </div>

                  <div className="w-[415px] mb-4">
                    <p className="text-base font-semibold text-muted-foreground mb-1">
                      {t("Username")}
                    </p>
                    <Input
                      name="username"
                      onChange={handleInputChange}
                      placeholder={userData.username ? userData.username : "-"}
                      className="text-xl font-normal bg-secondary"
                      readOnly
                    ></Input>
                  </div>

                  <div className="flex flex-col w-[415px] mb-4 gap-1">
                    <p className="flex gap-1 text-base font-semibold text-muted-foreground">
                      {t("CurrentPassword")}
                      <p className="text-destructive">*</p>
                    </p>
                    <Textfield
                      name="currentPassword"
                      className="text-xl font-normal bg-secondary"
                      type="password"
                      showIcon={true}
                      iconName="lock"
                      placeholder=""
                      onChange={handleInputChange}
                    />
                    {currentPassError && (
                      <p className="text-sm font-light text-destructive italic mt-1">
                        {currentPassError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col w-[415px] mb-4 gap-1">
                    <p className="flex gap-1 text-base font-semibold text-muted-foreground">
                      {t("NewPassword")}
                      <p className="text-destructive">*</p>
                    </p>
                    <Textfield
                      name="newPassword"
                      className="text-xl font-normal bg-secondary"
                      type="password"
                      showIcon={true}
                      iconName="key"
                      placeholder=""
                      onChange={handleInputChange}
                    />
                    {newPassError && (
                      <p className="text-sm font-light text-destructive italic mt-1">
                        {newPassError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col w-[415px] mb-4 gap-1">
                    <p className="flex gap-1 text-base font-semibold text-muted-foreground">
                      {t("ConfirmPassword")}
                      <p className="text-destructive">*</p>
                    </p>
                    <Textfield
                      name="confirmPassword"
                      className="text-xl font-normal bg-secondary"
                      type="password"
                      showIcon={true}
                      iconName="check_circle"
                      placeholder=""
                      onChange={handleInputChange}
                    />
                    {confirmPassError && (
                      <p className="text-sm font-light text-destructive italic mt-1">
                        {confirmPassError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Button Back And Save    */}
            <div className="flex justify-end items-end gap-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push(`/${locale}/`)}
              >
                {t("Back")}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleChangePassword}
              >
                <span className="material-symbols-outlined text-2xl">save</span>
                {t("Save")}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
      {isPasswordDialogOpen && (
        <AlertCustom
          title={a("ConfirmPasswordChange")}
          description={a("ConfirmPasswordChangeDescription")}
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
    </div>
  );
}
