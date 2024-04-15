"use client";
import { useRouter } from "next/navigation";
import { ProfileDropDown } from "./navigation/ProfileDropDown";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center pr-5 h-full">
      <div>
        <span
          className="pl-4 cursor-pointer font-bold"
          onClick={() => {
            router.push("/");
          }}
        >
          {" "}
          Ecopass Conductor Portal
        </span>
      </div>
      {/* <div className="h-9 w-9 rounded-3xl border-blue-400 bg-gradient-to-t to-gray-200 via-gray-400 from-gray-800 border-2 border-solid"> */}{" "}
      <Tooltip>
        <TooltipTrigger>
          <ProfileDropDown />
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white rounded-md px-2 py-1 text-sm">
          <p>Your profile</p>
        </TooltipContent>
      </Tooltip>
      {/* </div> */}
    </div>
  );
};

export default Header;
