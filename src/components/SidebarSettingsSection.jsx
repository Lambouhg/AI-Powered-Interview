import React from "react";
import SidebarLink from "./SidebarLink";

const SidebarSettingsSection = () => {
  const settingsLinks = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a0311e6d02b5e74fceda6514c46a1cd1a10db5fa128b6bae0692575476fc19c6?placeholderIfAbsent=true&apiKey=ba51a233c83a477e90d0c8ad26bb2739",
      text: "Settings",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b3d5a18695b4ae4fd6c6bcde3485ca281f49ebca982243f58231de88706e2679?placeholderIfAbsent=true&apiKey=ba51a233c83a477e90d0c8ad26bb2739",
      text: "Help Center",
    },
  ];

  return (
    <div className="flex flex-col mt-8 w-full">
      <div className="flex gap-2.5 items-start self-start pl-8 text-sm font-semibold tracking-wide leading-6 text-gray-800 whitespace-nowrap max-md:pl-5">
        <div className="opacity-50">SETTINGS</div>
      </div>
      <div className="flex flex-col mt-6 w-full text-base font-medium leading-relaxed text-slate-500">
        {settingsLinks.map((link, index) => (
          <SidebarLink key={index} {...link} />
        ))}
      </div>
    </div>
  );
};

export default SidebarSettingsSection;
