import React, { useState } from "react";

interface Profile {
  address: string;
  age: number;
  id: number; // Make sure this is consistently defined as a number
  name: string;
  tel: string;
  users_id: number; // Ensure this maps to the correct user ID
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

interface CustomDropdownProps {
  alluserdata: User[]; // Use the centralized User type
  selectedUser: string | null;
  src: string; // This should remain a string
  handleSelectChange: (userName: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  alluserdata,
  selectedUser,
  src,
  handleSelectChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [img, setImg] = useState<string | undefined>(src); // Set initial img state to src

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleOptionClick = (profile: Profile) => {
    handleSelectChange(profile.name); // Update selected user
    setImg(src); // Set the img to the corresponding user's image if you have specific image URLs for each user
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className="relative w-[300px]">
      <div
        onClick={toggleDropdown} // Toggle dropdown on click
        className="p-2 border bg-card border-gray-300 rounded-md cursor-pointer h-[60px] flex items-center justify-between transition-transform duration-300"
      >
        <img
          src={img} // Replace with dynamic URL if available
          className="w-8 h-8 rounded-full mr-2"
          alt="Selected"
        />
        {selectedUser || "Select a User"}
        <span className="caret" />
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {alluserdata.map((user) =>
            user.profile.map((profile) => (
              <li
                key={profile.id}
                onClick={() => handleOptionClick(profile)}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={src || 'CN'} // Replace with dynamic URL if available
                  alt={profile.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                {profile.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
