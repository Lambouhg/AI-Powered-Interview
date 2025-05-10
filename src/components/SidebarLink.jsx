import React from "react";

const SidebarLink = ({ icon, text, active, badge }) => {
  const baseClasses =
    "flex gap-4 items-center py-3 pr-4 pl-8 w-full text-base font-medium leading-relaxed max-md:pl-5";
  const activeClasses = active
    ? "bg-violet-100 text-indigo-600"
    : "text-slate-500";

  return (
    <div className={`${baseClasses} ${activeClasses}`}>
      {active && (
        <div className="flex shrink-0 self-stretch my-auto w-1 h-8 bg-indigo-600 fill-indigo-600" />
      )}
      <img
        loading="lazy"
        src={icon}
        className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        alt=""
      />
      <div className="flex-1 shrink self-stretch my-auto basis-0">{text}</div>
      {badge && (
        <div className="flex flex-col w-6 text-sm font-semibold text-white">
          <div className="px-0.5 w-6 h-6 bg-indigo-600 rounded-full fill-indigo-600">
            {badge}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarLink;
