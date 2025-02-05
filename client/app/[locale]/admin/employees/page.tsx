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
  DropdownMenuItem,
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

export default function Page() {
  const a = useTranslations("Alert");

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const roles = [
    {
      value: "admin",
      label: "Admin",
      icon: "manage_accounts",
      variant: "blue",
    },
    {
      value: "inspector",
      label: "Inspector",
      icon: "person_search",
      variant: "red",
    },
    {
      value: "supervisor",
      label: "Supervisor",
      icon: "manage_accounts",
      variant: "yellow",
    },
  ];

  const statuses = [
    { value: "true", label: "Active", color: "bg-green", variant: "green" },
    {
      value: "false",
      label: "Inactive",
      color: "bg-destructive",
      variant: "red",
    },
  ];

  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const getData = async () => {
    try {
      console.log("Fetching data...");

      // Log the current values of state variables
      console.log("Selected Roles:", selectedRoles);
      console.log("Selected Status:", selectedStatus);
      console.log("Search Term:", searchTerm);

      // Construct query params for roles, active status, and search term
      const params = new URLSearchParams();

      // Add selected roles to params (if any)
      if (selectedRoles.length > 0) {
        params.append("roles", selectedRoles.join(","));
      } else {
        console.log("No roles selected.");
      }

      // Add active status to params
      if (selectedStatus !== null) {
        params.append("active", selectedStatus.toString()); // Assuming `selectedStatus` is a boolean
      } else {
        console.log("No status selected.");
      }

      // Add search term to params (if any)
      if (searchTerm) {
        console.log("Search Term:", searchTerm);
        params.append("search", searchTerm);
      } else {
        console.log("No search term.");
      }

      // If params are empty, log a message
      if (!params.toString()) {
        console.log("No query params to send.");
      }

      // Fetch data using fetchData utility with query params
      const data = await fetchData(
        "get",
        `/users?profile=true&image=true&user=true&${params.toString()}`,
        true
      );

      console.log(
        "Endpoint URL:",
        `/users?profile=true&image=true&user=true&${params.toString()}`
      );

      // Validate data format
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return []; // Return empty array if data format is incorrect
      }

      console.log("Fetched data successfully:", data);
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

      try {
        const tempRoles = selectedRoles;
        const tempStatus = selectedStatus;

        setSelectedRoles([]);
        setSelectedStatus(null);
        getData();
        setSelectedRoles(tempRoles);
        setSelectedStatus(tempStatus);
      } catch (error) {
        console.error("Error during reset:", error);
      }

      // Return the updated users list for optimistic rendering
      return prevUsers.map((user) =>
        user.id === userId ? { ...user, active: updatedStatus } : user
      );
    });
  };
  const handleUserUpdate = async (
    userId: number,
    password: string,
    active: boolean,
    role: role
  ) => {
    setAllUsers((prevUsers) => {
      const user = prevUsers.find((user) => user.id === userId);
      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return prevUsers;
      }

      const data: { active: boolean; password?: string; role: role } = {
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
      
      if(role !== user.role || password !== ""){
        (async () => {
          try {
            toast({
              variant: "success",
              title: "Update Successful",
              description:
                "The user's information has been successfully updated.",
            });

            await fetchData("put", `/user/${userId}`, true, data);
            await getData();
          } catch (error) {
            console.error("Update failed", error);
          }
        })();
      }

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

  const handleEditUserDialog = async (userId: number, index: number) => {
    const updatedUser = userRefs.current[index];

    if (
      updatedUser.username === sortedUser[index].username &&
      updatedUser.role === sortedUser[index].role &&
      updatedUser.password === ""
    ) {
      toast({
        variant: "default",
        title: "No Updates Applied",
        description: "The provided details were either blank or unchanged",
      });
      await setIsDialogOpen(false);
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
  const [sortOption, setSortOption] = useState<"Name" | "Type">("Name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedUser, setSortedUser] = useState<IUser[]>([]);

  useEffect(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let comparison = 0;

      if (sortOption === "Name") {
        // Ensure title is defined before comparing
        const titleA = a.title || a.username || ""; // Use an empty string if title is undefined
        const titleB = b.title || b.username || ""; // Use an empty string if title is undefined
        comparison = titleA.localeCompare(titleB);
      } else if (sortOption === "Type") {
        // Assuming type is a string, handle undefined if necessary
        const typeA = a.role || ""; // Replace 'role' with the correct property for "Type"
        const typeB = b.role || ""; // Replace 'role' with the correct property for "Type"
        comparison = typeA.localeCompare(typeB);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setSortedUser(sorted); // Update sorted checklists state
  }, [filteredUsers, sortOption, sortOrder]); // Dependencies to trigger the effect

  useEffect(() => {
    userRefs.current = sortedUser.map((employee) => ({
      username: employee.username,
      password: "",
      role: employee.role,
    }));
  }, [sortedUser]);

  return (
    <div className="flex flex-col ">
      {/* Search and Actions */}
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Manage Employees</h1>
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
                New Employee
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogHeader>
                <h1 className="text-2xl font-bold">Add New Employee</h1>
                <AlertDialogDescription>
                  Enter the username, password, and assign a role for the new
                  employee.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <FormProvider {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
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

                  <div className="flex flex-col gap-1">
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

                  <div className="flex flex-col gap-1">
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
                                shape="square"
                              >
                                supervisor
                              </BadgeCustom>
                            </SelectItem>
                            <SelectItem value="inspector">
                              <BadgeCustom
                                variant={"red"}
                                iconName="person_search"
                                showIcon={true}
                                shape="square"
                              >
                                inspector
                              </BadgeCustom>
                            </SelectItem>
                            <SelectItem value="admin">
                              <BadgeCustom
                                variant={"blue"}
                                iconName="manage_accounts"
                                showIcon={true}
                                shape="square"
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
                      variant="primary"
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
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Textfield
            iconName="search"
            showIcon={true}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`custom-shadow px-[10px]
               bg-card w-auto h-[40px] gap-[10px] inline-flex items-center
               justify-center rounded-md text-sm font-medium`}
            >
              <span className="material-symbols-outlined">swap_vert</span>
              <div className="text-lg">Sort</div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="p-2 gap-2">
              {/* Sort By label */}
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                Sort By
              </DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(value: string) =>
                  setSortOption(value as "Name" | "Type")
                }
              >
                <DropdownMenuRadioItem value="Name" className="text-base">
                  Name
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="Type" className="text-base">
                  Type
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              {/* Order label */}
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                Order
              </DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={(value: string) =>
                  setSortOrder(value as "asc" | "desc")
                }
              >
                <DropdownMenuRadioItem value="asc" className="text-base">
                  Ascending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc" className="text-base">
                  Descending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={`custom-shadow px-[10px] bg-card w-auto h-[40px] gap-[10px] inline-flex items-center justify-center rounded-md text-sm font-medium`}
            >
              <span className="material-symbols-outlined">page_info</span>
              <div className="text-lg">Filter</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex flex-col justify-center gap-2 p-2 z-50"
              align="end"
            >
              <div>
                <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                  Role
                </DropdownMenuLabel>

                {roles.map((role) => (
                  <DropdownMenuCheckboxItem
                    key={role.value}
                    checked={selectedRoles.includes(role.value)}
                    className={`text-base ${
                      selectedRoles.includes(role.value) ? "bg-muted/50" : ""
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
                      {role.label}
                    </BadgeCustom>
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuLabel className="p-0 text-sm font-semibold text-muted-foreground">
                  Status
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={selectedStatus}>
                  {statuses.map((status) => (
                    <DropdownMenuRadioItem
                      key={status.value}
                      value={status.value}
                      className={`text-base ${
                        selectedStatus === status.value ? "bg-muted/50" : ""
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
                          {status.label}
                        </div>
                      </BadgeCustom>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </div>

              <div className="flex w-full justify-end mt-4 gap-2">
                <Button size="sm" variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
                <Button size="sm" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Manage Employees Section */}
        <div className="bg-card p-4 rounded-lg">
          {/* Header */}

          <div className="bg-secondary rounded-lg border-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%] ">Id</TableHead>
                  <TableHead className="w-[30%]">Full Name</TableHead>
                  <TableHead className="w-[30%]">Role</TableHead>
                  <TableHead className="w-[30%]">Status</TableHead>
                  <TableHead className=" w-[1%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUser.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell className="font-medium items-center">
                      <div className="flex items-center gap-2">
                        <div>
                          {employee.profile.name ? (
                            <Avatar className="w-[22px] h-[22px]">
                              <AvatarImage
                                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${employee.profile.image?.path}`}
                              />
                              <AvatarFallback className="text-[10px] ">
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
                                No profile is provided
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
                      >
                        {employee.role}
                      </BadgeCustom>
                    </TableCell>
                    <TableCell>
                      <BadgeCustom
                        variant={employee.active ? "green" : "red"}
                        showIcon={true}
                      >
                        <div className="flex flex-row justify-center items-center gap-2 w-[105px]">
                          <div
                            className={` flex w-2 h-2  rounded-full ${
                              employee.active ? "bg-green" : "bg-destructive"
                            } `}
                          ></div>
                          {employee.active ? "Active" : "Inactive"}
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
                                  userRefs.current[index].password = "";
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
                                className="flex flex-col gap-4 "
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <AlertDialogHeader>
                                  <h1 className="text-2xl font-bold">
                                    Edit Employee
                                  </h1>
                                  <AlertDialogTitle></AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Enter the username, password, and assign a
                                    role for the employee.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="flex flex-col gap-1 pointer-events-none">
                                  <label>Username</label>
                                  <Textfield
                                    className="bg-secondary cursor-not-allowed "
                                    showIcon={true}
                                    iconName="person"
                                    onChange={() => {}}
                                    value={""}
                                    placeholder={employee.username}
                                  />
                                </div>

                                <div className=" flex flex-col gap-4">
                                  <div>
                                    <label>Password</label>
                                    <Textfield
                                      placeholder="Password"
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
                                              shape="square"
                                            >
                                              supervisor
                                            </BadgeCustom>
                                          </SelectItem>
                                          <SelectItem value="inspector">
                                            <BadgeCustom
                                              variant="red"
                                              iconName="person_search"
                                              showIcon={true}
                                              shape="square"
                                            >
                                              inspector
                                            </BadgeCustom>
                                          </SelectItem>
                                          <SelectItem value="admin">
                                            <BadgeCustom
                                              variant="blue"
                                              iconName="manage_accounts"
                                              showIcon={true}
                                              shape="square"
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
                                    onClick={async () => {
                                      handleDialogResult(false);
                                      try {
                                        setPendingAction(null); // Clear the pending action
                                        setDialogType(""); // Reset the dialog type after action is completed
                                      } catch (error) {}
                                    }}
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

                              {isDialogOpen === true &&
                                dialogType === "edit" && (
                                  <AlertCustom
                                    title={"Are you sure to edit employee?"}
                                    description={
                                      "Please confirm to edit employee."
                                    }
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
    </div>
  );
}
