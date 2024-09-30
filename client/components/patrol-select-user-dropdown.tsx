"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "./ui/scroll-area";

// interface Props {
//   inspectorNames: string[];
// }

export function BlankDropdown(
//   {
//   inspectorNames = []
// }: Props
)
 {
  const [isOuterFlipped, setIsOuterFlipped] = useState(false);
  const [isInnerFlipped, setIsInnerFlipped] = useState(false); // State to manage inner flip
  const [selectedValue, setSelectedValue] = useState<string>(""); // State to manage selected value
  const outerButtonRef = useRef<HTMLButtonElement>(null);

  const handleOuterClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation to avoid interfering with the inner Select
    setIsOuterFlipped((prev) => !prev); // Toggle outer dropdown
    if (isOuterFlipped) {
      setIsInnerFlipped(false); // Reset inner flip state when closing outer dropdown
    }
  };

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from closing the outer dropdown
    setIsInnerFlipped((prev) => !prev); // Toggle inner dropdown
  };

  const handleSelectChange = (value: string) => {
    setSelectedValue(value); // Update selected value
    setIsOuterFlipped(false); // Close outer dropdown after selection
    setIsInnerFlipped(false); // Close inner dropdown after selection
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        outerButtonRef.current &&
        !outerButtonRef.current.contains(event.target as Node)
      ) {
        setIsOuterFlipped(false); // Close the outer dropdown if clicked outside
        setIsInnerFlipped(false); // Close the inner dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, []);

  return (
    <div>
      <ScrollArea>
        <div>
          <Button
            ref={outerButtonRef}
            variant="ghost"
            className={`text-input w-[226px] ${
              isOuterFlipped ? "h-[200px]" : "h-[50px]"
            } w-full bg-card gap-[10px] space-x-4 py-[10px] px-[20px] transition-all duration-300`}
            onClick={handleOuterClick} // Outer button click handler
          >
            <div className="flex items-center gap-2">
              <div>
                {/* Checklist name here */}
                Overall Facility Check
                {selectedValue ? `Selected: ${selectedValue}` : "Select Theme"}
              </div>
              <span
                className={`material-symbols-outlined inline-block transition-transform duration-300 ${
                  isOuterFlipped ? "rotate-180" : "rotate-0"
                }`}
              >
                expand_more
              </span>
            </div>

            {isOuterFlipped && (
              <div onClick={handleInnerClick}>
                {/* Prevent click from closing the outer dropdown */}
                <select
                  name="theme"
                  id="theme"
                  onChange={(e) => handleSelectChange(e.target.value)}
                  className={`w-full p-2 border border-gray-300 rounded-md transition-all duration-300`}
                >
                  <option value="">Select a Patrol</option>
                  {/* Iterate over inspectorNames and display each as an option */}
                  {/* {inspectorNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))} */}
                </select>
              </div>
            )}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
