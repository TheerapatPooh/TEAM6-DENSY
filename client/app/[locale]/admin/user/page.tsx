"use client";
import { IUser, role } from "@/app/type";
import { AlertCustom } from "@/components/alert-custom";
import BadgeCustom, { badgeVariants } from "@/components/badge-custom";
import Textfield from "@/components/textfield";
import {
  AlertDialog,
  AlertDialogAction,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchData } from "@/lib/utils";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";

export default function Page() {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData("get", "/users", true);
        setAllUsers(data);
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  const form = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data) => {
    console.log(data);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dialogType, setDialogType] = useState<string>("");

  const handleUserUpdateActive = async (userId: number) => {
    setAllUsers((prevUsers) => {
      const user = prevUsers.find((user) => user.id === userId);
      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return prevUsers;
      }

      const updatedStatus = !user.active; // Toggle the status
      const data = { active: updatedStatus };

      // Perform the API update inside the async function
      (async () => {
        try {
          await fetchData("put", `/user/${userId}`, true, data);
          console.log(`User ${userId} status updated to ${updatedStatus}`);
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
    username: string,
    password: string,
    role: role
  ) => {
    setAllUsers((prevUsers) => {
      const user = prevUsers.find((user) => user.id === userId);
      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return prevUsers;
      }

      const data = { username: username, password: password, role: role };

      (async () => {
        try {
          await fetchData("put", `/user/${userId}`, true, data);
        } catch (error) {
          console.error("Update failed", error);
        }
      })();

      return prevUsers.map((user) =>
        user.id === userId ? { ...user, username: username, role: role } : user
      );
    });
  };
  
const handleInactiveUser = (userId: number) => {
  setPendingAction(() => () => handleUserUpdateActive(userId));
  setDialogType("deactivate"); // Set the dialog type as "deactivate"
  handleOpenDialog();
};

const handleEditUser = (index: number, userId: number) => {
  setPendingAction(() => () => handleSave(index,userId));
  setDialogType("edit"); // Set the dialog type as "edit"
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
  const handleSave = (index: number, userId: number) => {
    
    const updatedUser = userRefs.current[index];
    if (updatedUser) {
      handleUserUpdate(
        userId,
        updatedUser.username,
        updatedUser.password,
        updatedUser.role
      );
      console.log(updatedUser);
    } else {
      console.error(`User at index ${index} is undefined`);
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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="default">+ New Employee</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the username, password, and assign a role for the new
                  employee.
                </DialogDescription>
              </DialogHeader>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-6">
                    <label>Username</label>
                    <Textfield
                      className="bg-secondary"
                      showIcon={true}
                      iconName="person"
                      placeholder="Username"
                      {...register("username", {
                        required:
                          "Please provide a valid username in the fields.",
                      })}
                    />
                  </div>

                  <div className="mt-6">
                    <label>Password</label>
                    <Textfield
                      className="bg-secondary"
                      type=""
                      showIcon={true}
                      iconName="lock"
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is required.",
                      })}
                    />
                  </div>

                  <div className="mt-6">
                    <label>Role</label>
                    <div className="relative bg-secondary rounded-md ">
                      <Select>
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
                    <DialogClose asChild>
                      <Button variant="secondary" type="button">
                        Back
                      </Button>
                    </DialogClose>
                    <Button>+ New Employee</Button>
                  </div>
                </form>
              </FormProvider>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-secondary rounded-lg shadow border border-gray-300">
          <div className="grid grid-cols-4 gap-0 border-b border-gray-300 px-3 py-2 text-[#707A8A] font-bold">
            <div className="flex items-center col-span-1 px-3 py-2">
              Full Name
            </div>
            <div className="flex items-center col-span-1 px-3 py-2">Role</div>
            <div className="flex items-center col-span-1 px-3 py-2">Status</div>
            <div className="col-span-1"></div>
          </div>
          {allUsers &&
            allUsers.map((employee, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-0 items-center border-b border-gray-300 px-3 py-3"
              >
                <div className="flex items-center col-span-1 px-3 text-[#707A8A] font-Inter">
                  {employee.username}
                </div>
                <div className="flex items-center col-span-1 px-3 text-[#707A8A] font-Inter">
                  <BadgeCustom
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
                </div>
                <div className="flex items-center col-span-1 px-3 text-[#707A8A] font-Inter">
                  <BadgeCustom
                    variant={employee.active ? "green" : "red"}
                    iconName="Circle"
                    showIcon={true}
                  >
                    {employee.active ? "active" : "inactive"}
                  </BadgeCustom>
                </div>
                {/* Buttons for edit and toggle status */}
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" className="w-[45px] h-[45px]">
                        <span className="material-symbols-outlined items-center text-muted-foreground">
                          more_horiz
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex w-full text-[18px]"
                            >
                              {"Edit"}
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Edit Employee</AlertDialogTitle>
                              <AlertDialogDescription>
                                Enter the username, password, and assign a role
                                for the employee.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div
                              className="mt-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <label>Username</label>
                              <Textfield
                                className="bg-secondary"
                                showIcon={true}
                                iconName="person"
                                placeholder="Username"
                                onChange={(e) => {
                                  if (userRefs.current[index]) {
                                    userRefs.current[index].username =
                                      e.target.value;
                                  }
                                }}
                              />
                            </div>
                            <div
                              className="mt-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <label>Password</label>
                              <Textfield
                                className="bg-secondary"
                                showIcon={true}
                                iconName="lock"
                                placeholder="Password"
                                onChange={(e) => {
                                  if (userRefs.current[index]) {
                                    userRefs.current[index].password =
                                      e.target.value;
                                  }
                                }}
                              />
                            </div>
                            <div className="mt-6">
                              <label>Role</label>
                              <div className="relative bg-secondary rounded-md">
                                <Select
                                  onValueChange={(value) => {
                                    if (userRefs.current[index]) {
                                      userRefs.current[index].role =
                                        value as role; // Make sure value matches your role type
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
                            <AlertDialogFooter>
                              <AlertDialogCancel>Back</AlertDialogCancel>
                              <Button
                                variant="primary"
                                size="lg"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent click event from bubbling up
                                  handleEditUser(index, employee.id);
                                }}
                              >
                                Save
                              </Button>
                              {isDialogOpen && dialogType === "edit" && (
                                <AlertCustom
                                  title={"Are you sure to edit employee?"}
                                  description={
                                    "Please confirm to edit employee."
                                  }
                                  primaryBottonText={"Confirm"}
                                  primaryIcon="check"
                                  secondaryBottonText={"Cancel"}
                                  backResult={handleDialogResult}
                                />
                              )}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInactiveUser(employee.id); // Toggle status
                          }}
                          className="flex w-full text-[18px] text-destructive"
                        >
                          {employee.active ? "Inactivate" : "Activate"}
                        </div>
                        {isDialogOpen && dialogType === "deactivate" && (
                          <AlertCustom
                            title={
                              employee.active
                                ? "Are you sure to inactivate employee?"
                                : "Are you sure to activate employee?"
                            }
                            description={
                              employee.active
                                ? "Please confirm to inactivate employee."
                                : "Please confirm to activate employee."
                            }
                            primaryBottonText={"Confirm"}
                            primaryIcon="check"
                            secondaryBottonText={"Cancel"}
                            backResult={handleDialogResult}
                          />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
