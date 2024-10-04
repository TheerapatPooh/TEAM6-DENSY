"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomDropdown from "./custom-drop-down-with-image";

interface PatrolHasChecklist {
  checklistId: number;
  inspectorId: number;
}

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  lasted: boolean;
  updateAt: string;
  updateBy: number;
  version: number;
}

interface Props {
  checklist: ChecklistItem;
  handleSelectedUser: (user: PatrolHasChecklist) => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  department: string | null;
  created_at: string;
  profile: Profile[];
}

interface Profile {
  address: string;
  age: number;
  id: number;
  name: string;
  tel: string;
  users_id: number;
}

export function BlankDropdown({ checklist, handleSelectedUser }: Props) {
  const [isOuterFlipped, setIsOuterFlipped] = useState(false);
  const [isInnerFlipped, setIsInnerFlipped] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [alluserdata, setUser] = useState<User[]>([]);

  const outerButtonRef = useRef<HTMLButtonElement>(null);

  const handleOuterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOuterFlipped((prev) => !prev);
  };

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInnerFlipped((prev) => !prev);
  };

  const handleSelectChange = (value: string) => {
    setSelectedUser(value);

    const selectedInspector = alluserdata
      .flatMap((user) => user.profile)
      .find((profile) => profile.name === value);

    if (selectedInspector) {
      const patrolHasChecklist: PatrolHasChecklist = {
        checklistId: checklist.id,
        inspectorId: selectedInspector.users_id, // Ensure you're using the correct ID
      };
      handleSelectedUser(patrolHasChecklist); // Pass a single user object
    }

    setIsOuterFlipped(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const dataAllUser = await fetchData("get", "/users", true);
        setUser(dataAllUser);
        console.log(dataAllUser);

        const handleClickOutside = (event: MouseEvent) => {
          if (
            outerButtonRef.current &&
            !outerButtonRef.current.contains(event.target as Node)
          ) {
            setIsOuterFlipped(false);
            setIsInnerFlipped(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      } catch (error) {
        console.error("Failed to fetch patrol data:", error);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <div>
        <Button
          ref={outerButtonRef}
          variant="outline"
          className={`text-black ${
            isOuterFlipped ? "h-[160px]" : "h-[80px]"
          } grid grid-cols-1 w-full gap-[10px] px-[20px] transition-all duration-100 bg-secondary`}
          onClick={handleOuterClick}
        >
          <div className="flex items-center justify-between">
            <div className="text-[20px]">{checklist.title}</div>
            {selectedUser && <div>Selected User: {selectedUser}</div>}
            <span
              className={`material-symbols-outlined inline-block transition-transform duration-300 ${
                isOuterFlipped ? "rotate-180" : "rotate-0"
              }`}
            >
              expand_more
            </span>
          </div>

          {isOuterFlipped && (
            <div
              className="grid grid-cols-1 gap-2 transition-all duration-300 mb-10"
              onClick={handleInnerClick}
            >
              <div className="flex text-muted-foreground gap-2">
                <span className="material-symbols-outlined">engineering</span>
                <div className="text-muted-foreground">Inspector</div>
              </div>

              <CustomDropdown
                alluserdata={alluserdata}
                selectedUser={selectedUser}
                handleSelectChange={handleSelectChange}
                src="https://github.com/shadcn.png"
              />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
