// components/HeaderSection.js
"use client";
import React, { useEffect } from "react";
import { MapPin } from "lucide-react";
import OptionOfCompanytoUser from "./OptionOfCompanytoUser";
//import Image from "next/image";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

const HeaderSection = ({
  name,
  setName,
  avatar,
  location,
  setLocation,
  isEditing,
  setIsEditing,
  email,
  aboutMe,
  setEmail,
  phone,
  setPhone,
  Languages,
  instagram,
  setInstagram,
  twitter,
  setTwitter,
  expereince,
  education,
  setLanguages,
  skills,
  video,
  setVideo,
  linkedin,
  setLinkedin,
  youtube,
  setYoutube,
  facebook,
  setFacebook,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "role undefined";
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const updateData = {
      name,
      location,
      email,
      phone,
      aboutMe,
      Languages,
      socialLinks: {
        instagram,
        twitter,
        facebook,
        linkedin,
        youtube,
      },
      expereince,
      education,
      skills,
      video,
    };
    const res = await axios.patch("/api/user", {
      user: updateData,
    });
    const updatedUser = res.data.user;

    setName(updatedUser.name);
    setLocation(updatedUser.location);
    setEmail(updatedUser.email);
    setPhone(updatedUser.phone);
    setInstagram(updatedUser.socialLinks.instagram);
    setTwitter(updatedUser.socialLinks.twitter);
    setVideo(updatedUser.video);
    setFacebook(updatedUser.socialLinks.facebook);
    setLinkedin(updatedUser.socialLinks.linkedin);
    setYoutube(updatedUser.socialLinks.youtube);
    setLanguages(updatedUser.Languages);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Reset state về giá trị ban đầu (nếu cần)
    setIsEditing(false);
  };

  // Xử lý sự kiện beforeunload (đóng tab, refresh)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue =
          "When you leave this page all information is not saved. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);

  // Xử lý chuyển hướng trong App Router
  useEffect(() => {
    // Patch lại phương thức push của router để hiển thị cảnh báo
    if (isEditing) {
      const originalPush = router.push;
      const originalReplace = router.replace;
      const originalBack = router.back;

      // Ghi đè phương thức push
      router.push = (href) => {
        const confirmed = window.confirm(
          "When you leave this page all information is not saved. Are you sure you want to leave?"
        );
        if (confirmed) {
          originalPush.call(router, href);
        }
      };

      // Ghi đè phương thức replace
      router.replace = (href) => {
        const confirmed = window.confirm(
          "When you leave this page all information is not saved. Are you sure you want to leave?"
        );
        if (confirmed) {
          originalReplace.call(router, href);
        }
      };

      // Ghi đè phương thức back
      router.back = () => {
        const confirmed = window.confirm(
          "When you leave this page all information is not saved. Are you sure you want to leave?"
        );
        if (confirmed) {
          originalBack.call(router);
        }
      };

      // Patch lại window.history.pushState
      const originalPushState = window.history.pushState;
      window.history.pushState = function () {
        const confirmed = window.confirm(
          "When you leave this page all information is not saved. Are you sure you want to leave?"
        );
        if (confirmed) {
          return originalPushState.apply(this, arguments);
        }
      };

      // Patch window.history.replaceState
      const originalReplaceState = window.history.replaceState;
      window.history.replaceState = function () {
        const confirmed = window.confirm(
          "When you leave this page all information is not saved. Are you sure you want to leave?"
        );
        if (confirmed) {
          return originalReplaceState.apply(this, arguments);
        }
      };

      // Xử lý sự kiện popstate (back/forward)
      const handlePopState = () => {
        if (isEditing) {
          const confirmed = window.confirm(
            "When you leave this page all information is not saved. Are you sure you want to leave?"
          );
          if (!confirmed) {
            // Nếu người dùng hủy, thì đẩy lại trạng thái hiện tại
            history.pushState(null, "", pathname);
          }
        }
      };

      window.addEventListener("popstate", handlePopState);

      // Xử lý các liên kết trong ứng dụng
      const handleClick = (e) => {
        if (!isEditing) return;

        // Tìm thẻ a gần nhất
        let element = e.target;
        while (element && element.tagName !== "A") {
          element = element.parentElement;
        }

        // Nếu là liên kết nội bộ
        if (
          element &&
          element.href &&
          element.href.startsWith(window.location.origin)
        ) {
          e.preventDefault();
          const confirmed = window.confirm(
            "When you leave this page all information is not saved. Are you sure you want to leave?"
          );
          if (confirmed) {
            router.push(element.href.replace(window.location.origin, ""));
          }
        }
      };

      document.addEventListener("click", handleClick, true);

      return () => {
        // Khôi phục các phương thức ban đầu
        router.push = originalPush;
        router.replace = originalReplace;
        router.back = originalBack;
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
        window.removeEventListener("popstate", handlePopState);
        document.removeEventListener("click", handleClick, true);
      };
    }
  }, [isEditing, router, pathname]);

  return (
    <div className="rounded-lg overflow-hidden mb-6">
      <div className="h-32 bg-gradient-to-r from-pink-200 to-purple-600"></div>
      <div className="relative bg-white p-4">
        <div className="absolute -top-16 left-4">
          <img
            src={avatar}
            alt="Profile"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border-4 border-white"
          />
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-bold border-2 border-gray-400 rounded-md p-1 w-full"
                />
              ) : (
                <h1 className="text-xl font-bold">{name}</h1>
              )}

              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-2 border-gray-400 rounded-md p-1 mt-2 w-full"
                  />
                ) : (
                  <span>{location}</span>
                )}
              </div>
            </div>
            {role !== "company" &&
              (isEditing ? (
                <div>
                  <button
                    onClick={handleSaveClick}
                    className="px-4 py-2 border-2 border-gray-400 rounded-lg text-green-600 hover:bg-green-50 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-4 py-2 border-2 border-gray-400 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 border-2 border-gray-400 rounded-lg text-blue-600 hover:bg-blue-50"
                >
                  Edit Profile
                </button>
              ))}
          </div>
          {/* Option */}
          <OptionOfCompanytoUser role={role} />
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
