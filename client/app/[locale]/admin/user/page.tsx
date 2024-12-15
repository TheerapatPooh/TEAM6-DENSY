"use client";
import { IUser } from "@/app/type";
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

import React, { useState, useEffect } from "react";
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
            <DialogTrigger>
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
                        <SelectContent >
                          <SelectGroup >
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
            allUsers.map((employee, index) => {
              return (
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
                      variant={employee.active === true ? "red" : "green"}
                      iconName="Circle"
                      showIcon={true}
                    >
                      {employee.active === true ? "inactive" : "active"}
                    </BadgeCustom>
                  </div>
                  {/* ปุ่มเพิ่มเติม แก้ไขและเปลี่ยนสถานะ */}
                  <div className="col-span-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="w-[45px] h-[45px]">
                          <span className="material-symbols-outlined items-center text-muted-foreground">
                            more_vert
                          </span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="p-0">
                        <DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger
                              asChild
                              className="py-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="cursor-pointer w-full h-full flex"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                {"Edit"}
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Edit Employee
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Enter the username, password, and assign a
                                  role for the employee.
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
                                  {...register("username", {
                                    required:
                                      "Please provide a valid username in the fields.",
                                  })}
                                />
                              </div>

                              <div
                                className="mt-6"
                                onClick={(e) => e.stopPropagation()}
                              >
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
                                <div className="relative bg-secondary rounded-md">
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

                              <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <Button variant="primary" size="lg">
                                  Save
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="p-0">
                          <AlertDialog>
                            <AlertDialogTrigger
                              asChild
                              className="pl-2 py-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className=" text-destructive cursor-pointer w-full h-full flex"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                {"Inactive"}
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your patrol and remove your
                                  data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction>action</AlertDialogAction>
                                <AlertDialogAction>
                                  {"Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
