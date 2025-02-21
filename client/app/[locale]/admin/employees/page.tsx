"use client";
import { IUser, role } from "@/app/type";
import { AlertCustom } from "@/components/alert-custom";
import BadgeCustom from "@/components/badge-custom";
import Textfield from "@/components/textfield";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchData, getInitials } from "@/lib/utils";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import NotFound from "@/components/not-found";

export default function Page() {
  const t = useTranslations("General");
  const a = useTranslations("Alert");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const roles = [
    {
      value: "admin",
      label: t("admin"),
      icon: "manage_accounts",
      variant: "blue",
    },
    {
      value: "inspector",
      label: t("inspector"),
      icon: "person_search",
      variant: "red",
    },
    {
      value: "supervisor",
      label: t("supervisor"),
      icon: "manage_accounts",
      variant: "yellow",
    },
  ];

  const statuses = [
    { value: "true", label: ("Active"), color: "bg-green", variant: "green" },
    {
      value: "false",
      label: ("Inactive"),
      color: "bg-destructive",
      variant: "red",
    },
  ];

  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const getData = async () => {
    try {

      // Construct query params for roles, active status, and search term
      const params = new URLSearchParams();

      // Add selected roles to params (if any)
      if (selectedRoles.length > 0) {
        params.append("roles", selectedRoles.join(","));
      } else {

      }

      // Add active status to params
      if (selectedStatus !== null) {
        params.append("active", selectedStatus.toString()); // Assuming `selectedStatus` is a boolean
      } else {

      }

      // Add search term to params (if any)
      if (searchTerm) {
        params.append("search", searchTerm);
      } else {

      }



      // Fetch data using fetchData utility with query params
      const data = await fetchData(
        "get",
        `/users?profile=true&image=true&user=true&${params.toString()}`,
        true
      );



      // Validate data format
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return []; // Return empty array if data format is incorrect
      }


      setAllUsers(data); // Update state with the fetched data
      setFilteredUsers(data); // Initially set filtered data to all data

      return data; // Return fetched data
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch user data:", error); // Log error
      }
      return []; // Return empty array on error
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      console.log("Window width:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // เรียกใช้งานครั้งแรก
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  // Fetch and apply search filter on search term change
  useEffect(() => {
    const fetchAndFilter = async () => {
      const freshData = await getData(); // Fetch fresh data
      setFilteredUsers(freshData); // Update state with filtered data
    };

    fetchAndFilter();
  }, [searchTerm]); // Trigger fetch when search term changes

  const handleApply = async () => {
    const freshData = await getData(); // Fetch fresh data
    setFilteredUsers(freshData);
  };

  // Reset handler function
  const handleReset = async () => {
    try {
      setSelectedRoles([]);
      setSelectedStatus(null);
    } catch (error) {
      console.error("Error during reset:", error);
    }
  };

  // useEffect to fetch fresh data whenever selectedRoles or selectedStatus changes
  useEffect(() => {
    const fetchDataAfterReset = async () => {
      if (selectedRoles.length === 0 && selectedStatus === null) {
        const freshData = await getData(); // Fetch fresh data
        setFilteredUsers(freshData); // Reset to original data
      }
    };

    fetchDataAfterReset(); // Call fetchDataAfterReset when either state changes
  }, [selectedRoles, selectedStatus]); // Dependency array for state changes

  const form = useForm();
  const { handleSubmit } = form;

  const onSubmit = () => { };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dialogType, setDialogType] = useState<string>("");

  const handleUserUpdateActive = async (userId: number) => {
    // Toggle status and create data payload
    setFilteredUsers((prevUsers) => {
      const user = prevUsers.find((user) => user.id === userId);
      if (!user) {
        return prevUsers;
      }

      const updatedStatus = !user.active;


      // Show toast based on the new status
      toast({
        variant: "success",
        title: updatedStatus
          ? a("UserActivationSuccessful")
          : a("UserDeactivationSuccessful"),
        description: updatedStatus
          ? a("UserActivationSuccessfulDescription")
          : a("UserDeactivationSuccessfulDescription"),
      });

      return prevUsers.map((user) =>
        user.id === userId ? { ...user, active: updatedStatus } : user
      );
    });

    try {
      // Perform the API update after state update
      await fetchData("put", `/user/${userId}`, true, {
        active: !filteredUsers.find((user) => user.id === userId)?.active,
      });
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleUserUpdate = async (
    userId: number,
    password: string,
    active: boolean,
    role: role
  ) => {
    setFilteredUsers((prevUsers) => {
      const user = prevUsers.find((user) => user.id === userId);
      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return prevUsers;
      }

      const data: { active: boolean; password?: string; role: role } = {
        active,
        role,
      };

      // Add password to data if provided
      if (password && password.trim() !== "") {
        data.password = password;
      }

      // Check if there is no update to apply
      if (role === user.role && password === "") {
        toast({
          variant: "default",
          title: a("NoUpdatesApplied"),
          description: a("NoUpdatesAppliedDescription"),
        });
        return prevUsers; // No updates, return previous state
      }

      // Proceed to update if changes are detected
      const updatedUsers = prevUsers.map((user) =>
        user.id === userId
          ? {
            ...user,
            ...(data.role && { role: data.role }), // Update role if needed
            ...(password && { password: data.password }), // Update password if needed
            active: data.active, // Update active status
          }
          : user
      );

      // Perform the API update
      const updateUserData = async () => {
        try {
          toast({
            variant: "success",
            title: a("UserUpdateSuccessful"),
            description: a("UserUpdateSuccessfulDescription"),
          });
          await fetchData("put", `/user/${userId}`, true, data);
          await getData(); // Fetch latest data if needed
        } catch (error) {
          console.error("Update failed", error);
          toast({
            variant: "error",
            title: a("UserUpdateFailed"),
            description: a("UserUpdateFailedDescription"),
          });
        }
      };

      // Call update only if there are changes
      if (role !== user.role || password !== "") {
        updateUserData(); // Execute async update call
      }

      return updatedUsers; // Return updated user list for optimistic rendering
    });
  };


  let userCreate = useRef<editedUser>({
    username: "",
    password: "",
    role: "inspector", // Set a default role
  });

  const handleUserCreate = async (
    username: string,
    password: string,
    role: role
  ) => {
    const data = {
      username: username,
      password: password,
      role: role,
      active: true,
    };
    try {
      toast({
        variant: "success",
        title: a("EmployeeAdded"),
        description: a("EmployeeAddedDescription"),
      });
      const response = await fetchData("post", `/user`, true, data);
      setFilteredUsers((prev) => [...prev, response]);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // State to manage validation errors
  const [errorsForCreateUser, setErrorsForCreateUser] = React.useState({
    username: "",
    password: "",
  });

  const validateFieldsUserCreate = () => {
    const { username, password } = userCreate.current;
    const newErrors = { username: "", password: "" };
    if (!username) {
      newErrors.username = a("ValidUsernamePlease");
      toast({
        variant: "error",
        title: a("EmployeeAddedFailed"),
        description: a("EmployeeAddedFailedNotValidInfo"),
      });
    }
    if (!password) {
      newErrors.password = a("ValidPasswordPlease");
      toast({
        variant: "error",
        title: a("EmployeeAddedFailed"),
        description: a("EmployeeAddedFailedNotValidInfo"),
      });
    } else if (password.length < 8) {
      newErrors.password = a("PasswordNotLongEnough");
      toast({
        variant: "error",
        title: a("EmployeeAddedFailed"),
        description: a("PasswordNotLongEnough"),
      });
    }

    setErrorsForCreateUser(newErrors);

    return !newErrors.username && !newErrors.password;
  };

  const handleCreateUserDialog = () => {
    const { username, password, role } = userCreate.current;

    if (!validateFieldsUserCreate()) {
      return;
    }

    setPendingAction(() => () => handleUserCreate(username, password, role));
    setDialogType("create");
    handleOpenDialog();
  };

  const handleInactiveUserDialog = (userId: number) => {
    setPendingAction(() => () => handleUserUpdateActive(userId));
    setDialogType("deactivate");
    handleOpenDialog();
  };

  const [passwordErrorForEdit, setPasswordErrorForEdit] = useState<
    string | null
  >(null); // State for password error message

  const handleEditUserDialog = async (userId: number, index: number) => {
    const updatedUser = userRefs.current[index];

    if (
      updatedUser.username === sortedUser[index].username &&
      updatedUser.role === sortedUser[index].role &&
      updatedUser.password === ""
    ) {
      toast({
        variant: "default",
        title: a("NoUpdatesApplied"),
        description: a("NoUpdatesAppliedDescription"),
      });
      await setIsDialogOpen(false);
      return;
    }

    if (
      updatedUser &&
      updatedUser.password.length < 8 &&
      updatedUser.password !== ""
    ) {
      setPasswordErrorForEdit(a("EmployeeEditPasswordMinLengthErrorDescription"));
      toast({
        variant: "error",
        title: a("PasswordError"),
        description: a("PasswordNotLongEnough"),
      });
      return;
    } else {
      setPasswordErrorForEdit(null); // Clear error message when password is valid
      setPendingAction(() => () => handleSave(userId, index));
      setDialogType("edit");
      handleOpenDialog();
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDialogResult = (result: boolean) => {
    setIsDialogOpen(false);
    if (result && pendingAction) {
      pendingAction(); // Execute the pending action
      setPendingAction(null); // Clear the pending action
      setDialogType(""); // Reset the dialog type after action is completed
    }
  };

  type editedUser = {
    username: string;
    password: string;
    role: role;
  };

  const userRefs = useRef<editedUser[]>([]);

  // Initialize userRefs after first render

  // Handler to save the updated user data
  const handleSave = async (userId: number, index: number) => {
    const updatedUser = userRefs.current[index];
    const user = allUsers.find((user) => user.id === userId);

    if (updatedUser) {
      handleUserUpdate(
        userId,
        updatedUser.password,
        user.active,
        updatedUser.role
      );
    } else {
      console.error(`User at index ${userId} is undefined`);
    }
  };
  const [sortOption, setSortOption] = useState<"Name" | "Type" | "ID">("ID");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedUser, setSortedUser] = useState<IUser[]>([]);

  useEffect(() => {

    const sorted = [...filteredUsers].sort((a, b) => {
      let comparison = 0;

      // Sort by Name
      if (sortOption === "Name") {
        const titleA = a.title || a.username || ""; // Handle undefined values
        const titleB = b.title || b.username || ""; // Handle undefined values
        comparison = titleA.localeCompare(titleB);
      }
      // Sort by Type
      else if (sortOption === "Type") {
        const typeA = a.role || ""; // Handle undefined values
        const typeB = b.role || ""; // Handle undefined values
        comparison = typeA.localeCompare(typeB);
      }
      // Sort by ID
      else if (sortOption === "ID") {
        comparison = a.id - b.id; // Assume ID is a number
      }

      return sortOrder === "asc" ? comparison : -comparison; // Ascending/Descending order
    });

    setSortedUser(sorted); // Set the sorted users list

  }, [filteredUsers, sortOption, sortOrder]); // Dependencies (no need for `allUsers` here)

  useEffect(() => {
    userRefs.current = sortedUser.map((employee) => ({
      username: employee.username,
      password: "",
      role: employee.role,
    }));
  }, [sortedUser, allUsers]);

  return (
    <div className="flex flex-col ">
      {/* Search and Actions */}
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">{t("ManageEmployees")}</h1>
        <div className="flex justify-between items-center mb-4">
          <AlertDialog
            open={
              isDialogOpen &&
              (dialogType === "add_user_menu" || dialogType === "create")
            }
            onOpenChange={(open) => {
              if (!open) {
                setIsDialogOpen(false);
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                className="gap-2"
                variant="primary"
                onClick={() => {
                  userCreate.current = {
                    username: "",
                    password: "",
                    role: "inspector",
                  }; // Default values
                  setDialogType("add_user_menu");
                  setIsDialogOpen(true);
                  setErrorsForCreateUser({
                    username: "",
                    password: "",
                  });
                }}
                size="default"
              >
                <span className="material-symbols-outlined">add</span>
                {t("NewEmployee")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogHeader>
                <h1 className="text-2xl font-bold">{t("AddNewEmployee")}</h1>
                <AlertDialogDescription>
                  {t("AddNewEmployeeDescription")}{" "}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <FormProvider {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1 w-96">
                    <label>{t("Username")}</label>
                    <Textfield
                      className="bg-secondary"
                      showIcon={true}
                      iconName="person"
                      placeholder={t("Username")}
                      onChange={(e) => {
                        if (userCreate.current) {
                          userCreate.current.username = e.target.value;
                        }
                        setErrorsForCreateUser((prev) => ({
                          ...prev,
                          username: "",
                        })); // Clear error on input change
                      }}
                    />
                    {errorsForCreateUser.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsForCreateUser.username}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-96">
                    <label>{t("Password")}</label>
                    <Textfield
                      className="bg-secondary"
                      showIcon={true}
                      iconName="lock"
                      placeholder={t("Password")}
                      onChange={(e) => {
                        if (userCreate.current) {
                          userCreate.current.password = e.target.value;
                        }
                        setErrorsForCreateUser((prev) => ({
                          ...prev,
                          password: "",
                        })); // Clear error on input change
                      }}
                    />
                    {errorsForCreateUser.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsForCreateUser.password}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label>{t("Role")}</label>
                    <div className="relative rounded-md w-auto">
                      <Select
                        defaultValue="inspector"
                        onValueChange={(value) => {
                          userCreate.current.role = value as role;
                        }}
                      >
                        <SelectTrigger className="bg-secondary w-96 h-auto p-2 rounded-md border-none">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="supervisor">
                              <BadgeCustom
                                variant={"yellow"}
                                iconName="engineering"
                                showIcon={true}
                                shape="square"
                              >
                                {t("supervisor")}
                              </BadgeCustom>
                            </SelectItem>
                            <SelectItem value="inspector">
                              <BadgeCustom
                                variant={"red"}
                                iconName="person_search"
                                showIcon={true}
                                shape="square"
                              >
                                {t("inspector")}
                              </BadgeCustom>
                            </SelectItem>
                            <SelectItem value="admin">
                              <BadgeCustom
                                variant={"blue"}
                                iconName="manage_accounts"
                                showIcon={true}
                                shape="square"
                              >
                                {t("admin")}
                              </BadgeCustom>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end items-center gap-4">
                    <AlertDialogCancel asChild>
                      <Button variant="secondary" type="button">
                        {t("Back")}
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      className="flex gap-2"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from bubbling up
                        handleCreateUserDialog();
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                      {t("AddNewEmployee")}{" "}
                    </Button>
                    {isDialogOpen && dialogType === "create" && (
                      <AlertCustom
                        title={a("SureToAddEmployee")}
                        description={a("SureToAddEmployeeDescription")}
                        primaryButtonText={t("Confirm")}
                        primaryIcon="check"
                        secondaryButtonText={t("Cancel")}
                        backResult={(result) => handleDialogResult(result)}
                      />
                    )}
                  </div>
                </form>
              </FormProvider>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Textfield
            iconName="search"
            showIcon={true}
            placeholder={t("Search")}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`custom-shadow px-[10px]
               bg-card w-auto h-[40px] gap-[10px] inline-flex items-center
               justify-center rounded-md text-sm font-medium`}
            >
              <span className="material-symbols-outlined">swap_vert</span>
              <div className="text-lg">{t("Sort")}</div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="p-2 gap-2">
              {/* Sort By label */}
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("SortBy")}
              </DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(value: string) =>
                  setSortOption(value as "Name" | "Type" | "ID")
                }
              >
                <DropdownMenuRadioItem value="Name" className="text-base">
                  {t("Name")}
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="Type" className="text-base">
                  {t("Type")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ID" className="text-base">
                  {t("Id")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              {/* Order label */}
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                {t("Order")}
              </DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={(value: string) =>
                  setSortOrder(value as "asc" | "desc")
                }
              >
                <DropdownMenuRadioItem value="asc" className="text-base">
                  {t("Ascending")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc" className="text-base">
                  {t("Descending")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium`}
            >
              <span className="material-symbols-outlined">page_info</span>
              <div className="text-lg"> {t("Filter")}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex flex-col justify-center gap-2 p-2 z-50"
              align="end"
            >
              <div>
                <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                  {t("Role")}
                </DropdownMenuLabel>

                {roles.map((role) => (
                  <DropdownMenuCheckboxItem
                    key={role.value}
                    checked={selectedRoles.includes(role.value)}
                    className={`text-base ${selectedRoles.includes(role.value) ? "bg-muted/50" : ""
                      }`}
                    onSelect={(e) => {
                      e.preventDefault();
                      // Toggle role selection in the array
                      setSelectedRoles((prevSelectedRoles) =>
                        prevSelectedRoles.includes(role.value)
                          ? prevSelectedRoles.filter(
                            (item) => item !== role.value
                          )
                          : [...prevSelectedRoles, role.value]
                      );
                    }}
                  >
                    <BadgeCustom
                      shape="square"
                      variant={
                        role.variant as
                        | "blue"
                        | "red"
                        | "yellow"
                        | "green"
                        | "default"
                        | "secondary"
                        | "mint"
                        | "orange"
                        | "purple"
                      }
                      iconName={role.icon}
                      showIcon={true}
                    >
                      {t(role.value)}
                    </BadgeCustom>
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                  {t("Status")}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={selectedStatus}>
                  {statuses.map((status) => (
                    <DropdownMenuRadioItem
                      key={status.value}
                      value={status.value}
                      className={`text-base ${selectedStatus === status.value ? "bg-muted/50" : ""
                        }`}
                      onSelect={(e) => {
                        if (
                          status.value === "true" ||
                          status.value === "false"
                        ) {
                          setSelectedStatus(null);
                        }
                        e.preventDefault();
                        setSelectedStatus(status.value);
                      }}
                    >
                      <BadgeCustom
                        variant={
                          status.variant as
                          | "blue"
                          | "red"
                          | "yellow"
                          | "green"
                          | "default"
                          | "secondary"
                          | "mint"
                          | "orange"
                          | "purple"
                        }
                      >
                        <div className="flex flex-row justify-center items-center gap-2 w-[105px]">
                          <div
                            className={`flex w-2 h-2 rounded-full ${status.color}`}
                          ></div>
                          {t(status.label)}
                        </div>
                      </BadgeCustom>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </div>

              <div className="flex w-full justify-end mt-4 gap-2">
                <Button size="sm" variant="secondary" onClick={handleReset}>
                  {t("Reset")}
                </Button>
                <Button size="sm" onClick={handleApply}>
                  {t("Apply")}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Manage Employees Section */}

        {/* Header */}
        {sortedUser.length > 0 ? (
          <div className="bg-secondary rounded-lg border-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%] ">{t("Id")}</TableHead>
                  <TableHead className="w-[30%]">{t("FullName")}</TableHead>
                  <TableHead className="w-[30%]">{t("Role")}</TableHead>
                  <TableHead className="w-[30%]">{t("Status")}</TableHead>
                  <TableHead className=" w-[1%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUser.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {employee.id}
                    </TableCell>
                    <TableCell className="font-medium items-center">
                      <div className="flex items-center gap-2">
                        <div>
                          {employee.profile.name ? (
                            <Avatar className="custom-shadow h-[35px] w-[35px]">
                              <AvatarImage
                                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${employee.profile.image?.path}`}
                              />
                              <AvatarFallback
                                id={employee.id.toString()}
                                className="text-[10px] "
                              >
                                {getInitials(employee.profile.name)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Skeleton className="w-[22px] h-[22px] rounded-full bg-input" />
                          )}
                        </div>

                        <div>
                          {employee.profile.name ? (
                            employee.profile.name
                          ) : (
                            <div className="text-destructive">
                              {employee.username}
                              <div className="text-[14px]">
                                {t("NoProfileProvided")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <BadgeCustom
                        shape="square"
                        variant={
                          employee.role === "supervisor"
                            ? "yellow"
                            : employee.role === "admin"
                              ? "blue"
                              : employee.role === "inspector"
                                ? "red"
                                : "mint"
                        }
                        iconName={
                          employee.role === "supervisor"
                            ? "engineering"
                            : employee.role === "inspector"
                              ? "person_search"
                              : employee.role === "admin"
                                ? "manage_accounts"
                                : "account_circle"
                        }
                        showIcon={true}
                        hideText={windowWidth > 911 ? false : true}
                      >
                        {t(employee.role)}
                      </BadgeCustom>
                    </TableCell>
                    <TableCell>
                      <BadgeCustom
                        variant={employee.active ? "green" : "red"}
                        showIcon={true}
                      >
                        <div
                          className={`flex flex-row justify-center items-center gap-2 ${windowWidth <= 911 ? "w-[25px]" : "w-[105px]"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${employee.active ? "bg-green" : "bg-destructive"
                              }`}
                          ></div>
                          {windowWidth > 911 && (employee.active ? t("Active") : t("Inactive"))}
                        </div>
                      </BadgeCustom>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            className="w-[45px] h-[45px]"
                            onClick={() => setDialogType("blank")}
                          >
                            <span className="material-symbols-outlined items-center text-muted-foreground">
                              more_horiz
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="px-4 py-2"
                        >
                          <div className=" cursor-pointer">
                            <AlertDialog
                              open={
                                (isDialogOpen && dialogType === "editform") ||
                                dialogType === "edit"
                              }
                            >
                              <AlertDialogTrigger
                                asChild
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDialogOpen(true);
                                  setPasswordErrorForEdit(null);
                                  setDialogType("editform");
                                  userRefs.current[index].password = "";
                                }}
                              >
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex w-full text-[18px]"
                                >
                                  {t("Edit")}
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent
                                className="flex flex-col gap-4 "
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <AlertDialogHeader>
                                  <h1 className="text-2xl font-bold">
                                    {t("EditEmployee")}
                                  </h1>
                                  <AlertDialogTitle></AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t("EditEmployeeDescription")}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="flex flex-col gap-1 pointer-events-none">
                                  <label> {t("Username")}</label>
                                  <Textfield
                                    className="bg-secondary cursor-not-allowed "
                                    showIcon={true}
                                    iconName="person"
                                    onChange={() => { }}
                                    value={""}
                                    placeholder={employee.username}
                                  />
                                </div>

                                <div className=" flex flex-col gap-4">
                                  <div>
                                    <label>{t("Password")}</label>
                                    <Textfield
                                      placeholder={t("Password")}
                                      className={`bg-secondary`}
                                      showIcon={true}
                                      iconName="lock"
                                      onChange={(e) => {
                                        try {
                                          if (userRefs.current[index]) {
                                            userRefs.current[index].password =
                                              e.target.value;
                                          }

                                          // Validate password length
                                          if (e.target.value.length < 8) {
                                            setPasswordErrorForEdit(
                                              "Password must be at least 8 characters long."
                                            );
                                          } else {
                                            setPasswordErrorForEdit(null);
                                          }
                                        } catch (error) {
                                          console.error(
                                            "Error in onChange handler:",
                                            error
                                          );
                                        }
                                      }}
                                    />
                                  </div>

                                  {passwordErrorForEdit && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {passwordErrorForEdit}
                                    </p>
                                  )}
                                </div>

                                <div className="">
                                  <label>{t("Role")}</label>
                                  <div className="relative bg-secondary rounded-md">
                                    <Select
                                      defaultValue={employee.role}
                                      onValueChange={(value) => {
                                        if (userRefs.current[index]) {
                                          userRefs.current[index].role =
                                            value as role; // Ensure the value matches the type
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="bg-secondary w-full p-2 rounded-md border-none">
                                        <SelectValue placeholder="" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectItem value="supervisor">
                                            <BadgeCustom
                                              variant="yellow"
                                              iconName="engineering"
                                              showIcon={true}
                                              shape="square"
                                            >
                                              {t("supervisor")}
                                            </BadgeCustom>
                                          </SelectItem>
                                          <SelectItem value="inspector">
                                            <BadgeCustom
                                              variant="red"
                                              iconName="person_search"
                                              showIcon={true}
                                              shape="square"
                                            >
                                              {t("inspector")}
                                            </BadgeCustom>
                                          </SelectItem>
                                          <SelectItem value="admin">
                                            <BadgeCustom
                                              variant="blue"
                                              iconName="manage_accounts"
                                              showIcon={true}
                                              shape="square"
                                            >
                                              {t("admin")}
                                            </BadgeCustom>
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <AlertDialogFooter>
                                  <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={async () => {
                                      handleDialogResult(false);
                                      setPendingAction(null); // Clear the pending action
                                      setDialogType(""); // Reset the dialog type after action is completed
                                    }}
                                  >
                                    {t("Back")}
                                  </Button>
                                  <Button
                                    className=" flex  justify-center gap-2"
                                    variant="primary"
                                    size="lg"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent click event from bubbling up
                                      handleEditUserDialog(
                                        employee.id,
                                        index
                                      );
                                    }}
                                  >
                                    <span className="material-symbols-outlined">
                                      save
                                    </span>
                                    {t("Save")}
                                  </Button>
                                </AlertDialogFooter>
                              </AlertDialogContent>

                              {isDialogOpen === true &&
                                dialogType === "edit" && (
                                  <AlertCustom
                                    title={a("SureToEditEmployee")}
                                    description={
                                      a("SureToEditEmployeeDescription")
                                    }
                                    primaryButtonText={t("Confirm")}
                                    primaryIcon="check"
                                    secondaryButtonText={t("Cancel")}
                                    backResult={handleDialogResult}
                                  />
                                )}
                            </AlertDialog>
                          </div>
                          <div className=" cursor-pointer">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInactiveUserDialog(employee.id);
                              }}
                              className="flex w-full text-[18px] text-destructive"
                            >
                              {employee.active
                                ? t("Deactivate")
                                : t("Activate")}
                            </div>
                            {isDialogOpen === true &&
                              dialogType === "deactivate" && (
                                <AlertCustom
                                  title={
                                    employee.active
                                      ? a("SureToDeactivate")
                                      : a("SureToActivate")
                                  }
                                  description={
                                    employee.active
                                      ? a("SureToDeactivateDescription")
                                      : a("SureToActivateDescription")
                                  }
                                  primaryButtonText={t("Confirm")}
                                  primaryIcon="check"
                                  secondaryButtonText={t("Cancel")}
                                  backResult={handleDialogResult}
                                />
                              )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="col-span-full min-h-[261px]">
            <NotFound
              icon="quick_reference_all"
              title="NoDataAvailable"
              description="NoDataAvailableDescription"
            />
          </div>
        )}
      </div>
    </div>
  );
}
