import { Bell } from "lucide-react";

const NotificationIcon = () => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center cursor-pointer mb-2">
      {/* Icon chuông */}
      <Bell className="w-11 h-11 text-gray-600" />
    </div>
  );
};

export default NotificationIcon;
