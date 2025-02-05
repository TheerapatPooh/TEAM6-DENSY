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
  DropdownMenuContent,
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

export default function Page() {

  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData(
          "get",
          "/users?profile=true&image=true&user=true",
          true
        );
        setAllUsers(data);
      } catch (error) {
        console.error("Get failed", error);
      }
    };
    getData();
  }, []);

  const form = useForm();
  const {
    handleSubmit,
  } = form;

  const onSubmit = () => {
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dialogType, setDialogType] = useState<string>("");

  const handleUserUpdateActive = async (userId: number) => {
    setAllUsers((prevUsers) => {
      const user = prevUsers.find((user) => user.id === userId);
      if (!user) {
        return prevUsers;
      }

      const updatedStatus = !user.active; // Toggle the status
      const data = { active: updatedStatus };
      
      if (updatedStatus === true) {
        toast({
          variant: "success",
          title: "User Activation Successful",
          description: "The user's account has been activated.",
        });
      }
      if (updatedStatus === false) {
        toast({
          variant: "success",
          title: "User Deactivation Successful",
          description: "The user's account has been deactivated.",
        });
      }
      // Perform the API update inside the async function
      (async () => {
        try {
          await fetchData("put", `/user/${userId}`, true, data);
        } catch (error) {
          console.error("Update failed", error);
        }
      })();

      // Return the updated users list for optimistic rendering
      return prevUsers.map((user) =>
        user.id === userId ? { ...user, active: updatedStatus } : user
      );
    });
  };
  const handleUserUpdate = async (
    userId: number,
    password: string,
    active:boolean,
    role: role
  ) => {
    setAllUsers((prevUsers) => {
      const user = prevUsers.find((user) => user.id === userId);
      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return prevUsers;
      }

      const data: {active:boolean; password?: string; role: role } = {
        active,
        role,
      };

      if (password && password.trim() !== "") {
        data.password = password;
      }

      if (role === user.role && password === "") {
        toast({
          variant: "default",
          title: "No Updates Applied",
          description: "The provided details were either blank or unchanged",
        });
        return prevUsers;
      }

      (async () => {
        try {
          toast({
            variant: "success",
            title: "Update Successful",
            description:
              "The user's information has been successfully updated.",
          });

          await fetchData("put", `/user/${userId}`, true, data);
        } catch (error) {
          console.error("Update failed", error);
        }
      })();

      return prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              ...(data.role && { role: data.role }),
            }
          : user
      );
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
        title: "Employee Added",
        description: "You have successfully added employee.",
      });
      const response = await fetchData("post", `/user`, true, data);
      setAllUsers((prev) => [...prev, response]);
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
      newErrors.username = "Please provide a valid username in the fields.";
      toast({
        variant: "error",
        title: "Add new Employee Failed",
        description: "Please provide a valid informations in the fields.",
      });
    }
    if (!password) {
      newErrors.password = "Please provide a valid Password in the fields.";
      toast({
        variant: "error",
        title: "Add new Employee Failed",
        description: "Please provide a valid informations in the fields.",
      });
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      toast({
        variant: "error",
        title: "Add new Employee Failed",
        description: "Password must be at least 8 characters long.",
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

  const handleEditUserDialog = (userId: number, index: number) => {
    const updatedUser = userRefs.current[index];

    if (
      updatedUser.username === allUsers[index].username &&
      updatedUser.role === allUsers[index].role &&
      updatedUser.password === ""
    ) {
      toast({
        variant: "default",
        title: "No Updates Applied",
        description: "The provided details were either blank or unchanged",
      });
      setIsDialogOpen(false);
      return;
    }

    if (
      updatedUser &&
      updatedUser.password.length < 8 &&
      updatedUser.password !== ""
    ) {
      setPasswordErrorForEdit("Password must be at least 8 characters long.");
      toast({
        variant: "error",
        title: "Password Error",
        description: "Password must be at least 8 characters long.",
      });
      return;
    } else {
      setPasswordErrorForEdit(null); // Clear error message when password is valid
    }

    setPendingAction(() => () => handleSave(userId, index));
    setDialogType("edit");
    handleOpenDialog();
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
  useEffect(() => {
    userRefs.current = allUsers.map((employee) => ({
      username: employee.username,
      password: "",
      role: employee.role,
    }));
  }, [allUsers]);

  // Handler to save the updated user data
  const handleSave = (userId: number, index: number) => {
    const updatedUser = userRefs.current[index];
    const user = allUsers.find((user) => user.id === userId);

    if (updatedUser) {
      handleUserUpdate(userId, updatedUser.password,user.active, updatedUser.role);
    } else {
      console.error(`User at index ${userId} is undefined`);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-y-4">
      {/* Search and Actions */}
      <div className="flex items-center gap-2">
        <Textfield iconName="search" showIcon={true} placeholder="Search" />
        <div className="custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium">
          <span className="material-symbols-outlined">swap_vert</span>
          <div className="text-lg">Sort</div>
        </div>
        <div className="custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium">
          <span className="material-symbols-outlined">page_info</span>
          <div className="text-lg">Filter</div>
        </div>
      </div>

      {/* Manage Employees Section */}
      <div className="bg-card p-6 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-2xl">Manage Employees</h1>
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
                New Employee
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Employee</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter the username, password, and assign a role for the new
                  employee.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-6">
                    <label>Username</label>
                    <Textfield
                      className="bg-secondary"
                      showIcon={true}
                      iconName="person"
                      placeholder="Username"
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

                  <div className="mt-6">
                    <label>Password</label>
                    <Textfield
                      className="bg-secondary"
                      showIcon={true}
                      iconName="lock"
                      placeholder="Password"
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

                  <div className="mt-6">
                    <label>Role</label>
                    <div className="relative bg-secondary rounded-md ">
                      <Select
                        defaultValue="inspector"
                        onValueChange={(value) => {
                          userCreate.current.role = value as role;
                        }}
                      >
                        <SelectTrigger className="bg-secondary w-full p-2 rounded-md border-none">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="supervisor">
                              <BadgeCustom
                                variant={"yellow"}
                                iconName="engineering"
                                showIcon={true}
                              >
                                supervisor
                              </BadgeCustom>
                            </SelectItem>
                            <SelectItem value="inspector">
                              <BadgeCustom
                                variant={"red"}
                                iconName="person_search"
                                showIcon={true}
                              >
                                inspector
                              </BadgeCustom>
                            </SelectItem>
                            <SelectItem value="admin">
                              <BadgeCustom
                                variant={"blue"}
                                iconName="manage_accounts"
                                showIcon={true}
                              >
                                admin
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
                        Back
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      className="flex gap-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from bubbling up
                        handleCreateUserDialog();
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                      New Employee
                    </Button>
                    {isDialogOpen && dialogType === "create" && (
                      <AlertCustom
                        title={"Are you sure to add new employee?"}
                        description={"Please confirm to add new employee."}
                        primaryButtonText={"Confirm"}
                        primaryIcon="check"
                        secondaryButtonText={"Cancel"}
                        backResult={(result) => handleDialogResult(result)}
                      />
                    )}
                  </div>
                </form>
              </FormProvider>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="bg-secondary rounded-lg shadow border border-gray-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] ">Id</TableHead>
                <TableHead className="w-[300px]">Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end w-[10px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell className="font-medium flex flex-row gap-2 items-center">
                    {employee.profile.name ? (
                      <Avatar>
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${employee.profile.image?.path}`}
                        />
                        <AvatarFallback id={employee.id?.toString()}>
                          {getInitials(employee.profile.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Skeleton className="h-12 w-12 rounded-full bg-input" />
                    )}
                    <div>
                      {employee.profile.name ? (
                        employee.profile.name
                      ) : (
                        <div className="text-destructive">
                          {employee.username}
                          <div className="text-[14px]">
                            No profile is provided
                          </div>
                        </div>
                      )}
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
                    >
                      {employee.role}
                    </BadgeCustom>
                  </TableCell>
                  <TableCell>
                    <BadgeCustom
                      variant={employee.active ? "green" : "red"}
                      showIcon={true}
                    >
                      <div className="flex flex-row justify-center items-center gap-2">
                        <div
                          className={` flex w-2 h-2  rounded-full ${
                            employee.active ? "bg-green" : "bg-destructive"
                          } `}
                        ></div>
                        {employee.active ? "active" : "inactive"}
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
                      <DropdownMenuContent align="end" className="px-4 py-2">
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
                              }}
                            >
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex w-full text-[18px]"
                              >
                                {"Edit"}
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                              onClick={(e) => e.stopPropagation()}
                            >
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Edit Employee
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Enter the username, password, and assign a
                                  role for the employee.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <div className="mt-6 pointer-events-none">
                                <label>Username</label>
                                <Textfield
                                  className="bg-secondary cursor-not-allowed"
                                  showIcon={true}
                                  iconName="person"
                                  placeholder={employee.username}
                                />
                              </div>

                              <div
                                className="mt-6 flex flex-col gap-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div>
                                  <label>Password</label>
                                  <Textfield
                                    className="bg-secondary"
                                    showIcon={true}
                                    iconName="lock"
                                    placeholder={employee.password}
                                    onChange={(e) => {
                                      if (userRefs.current[index]) {
                                        userRefs.current[index].password =
                                          e.target.value;
                                      }

                                      // Check if the password length is less than 8 characters
                                      if (e.target.value.length < 8) {
                                        setPasswordErrorForEdit(
                                          "Password must be at least 8 characters long."
                                        );
                                      } else {
                                        setPasswordErrorForEdit(null); // Clear error if valid
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

                              <div className="mt-6">
                                <label>Role</label>
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
                                          >
                                            supervisor
                                          </BadgeCustom>
                                        </SelectItem>
                                        <SelectItem value="inspector">
                                          <BadgeCustom
                                            variant="red"
                                            iconName="person_search"
                                            showIcon={true}
                                          >
                                            inspector
                                          </BadgeCustom>
                                        </SelectItem>
                                        <SelectItem value="admin">
                                          <BadgeCustom
                                            variant="blue"
                                            iconName="manage_accounts"
                                            showIcon={true}
                                          >
                                            admin
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
                                  onClick={() => handleDialogResult(false)}
                                >
                                  Back
                                </Button>
                                <Button
                                  className=" flex  justify-center gap-2"
                                  variant="primary"
                                  size="lg"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click event from bubbling up
                                    handleEditUserDialog(employee.id, index);
                                  }}
                                >
                                  <span className="material-symbols-outlined">
                                    save
                                  </span>
                                  Save
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>

                            {isDialogOpen === true && dialogType === "edit" && (
                              <AlertCustom
                                title={"Are you sure to edit employee?"}
                                description={"Please confirm to edit employee."}
                                primaryButtonText={"Confirm"}
                                primaryIcon="check"
                                secondaryButtonText={"Cancel"}
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
                            {employee.active ? "Deactivate" : "Activate"}
                          </div>
                          {isDialogOpen === true &&
                            dialogType === "deactivate" && (
                              <AlertCustom
                                title={
                                  employee.active
                                    ? "Are you sure to deactivate employee?"
                                    : "Are you sure to activate employee?"
                                }
                                description={
                                  employee.active
                                    ? "Please confirm to deactivate employee."
                                    : "Please confirm to activate employee."
                                }
                                primaryButtonText={"Confirm"}
                                primaryIcon="check"
                                secondaryButtonText={"Cancel"}
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
      </div>
    </div>
  );
}
