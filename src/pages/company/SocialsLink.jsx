"use client";
import React, { useState, useEffect } from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa"; // Import icons từ react-icons
import SidebarCompany from "../../components/SidebarCompany";
import HeaderCompany from "../../components/HeaderCompany";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Thêm constant cho danh sách platforms
const SOCIAL_PLATFORMS = {
  instagram: {
    name: "Instagram",
    icon: <FaInstagram className="w-5 h-5 text-pink-600" />,
    placeholder: "https://instagram.com/your-profile",
  },
  twitter: {
    name: "Twitter",
    icon: <FaTwitter className="w-5 h-5 text-blue-500" />,
    placeholder: "https://twitter.com/your-profile",
  },
  facebook: {
    name: "Facebook",
    icon: <FaFacebook className="w-5 h-5 text-blue-700" />,
    placeholder: "https://facebook.com/your-profile",
  },
  linkedin: {
    name: "LinkedIn",
    icon: <FaLinkedin className="w-5 h-5 text-blue-800" />,
    placeholder: "https://linkedin.com/company/your-company",
  },
  youtube: {
    name: "YouTube",
    icon: <FaYoutube className="w-5 h-5 text-red-600" />,
    placeholder: "https://youtube.com/c/your-channel",
  },
};

const SocialsLink = () => {
  const { user } = useUser();
  const [company, setCompany] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Fetch dữ liệu công ty từ API
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/company?userId=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }

        const data = await response.json();
        setCompany(data);

        // Chỉ lấy những social links có giá trị (không null)
        const linksArray = Object.entries(data.socialLinks || {})
          .filter(([_, url]) => url !== null && url !== "")
          .map(([platform, url]) => ({ platform, url }));
        setSocialLinks(linksArray);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    if (user) {
      fetchCompanyData();
    }
  }, [user]);

  // Hàm ánh xạ tên mạng xã hội với icon tương ứng
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <FaInstagram className="w-5 h-5 text-pink-600" />;
      case "twitter":
        return <FaTwitter className="w-5 h-5 text-blue-500" />;
      case "facebook":
        return <FaFacebook className="w-5 h-5 text-blue-700" />;
      case "linkedin":
        return <FaLinkedin className="w-5 h-5 text-blue-800" />;
      case "youtube":
        return <FaYoutube className="w-5 h-5 text-red-600" />;
      default:
        return <FaLink className="w-5 h-5 text-gray-500" />; // Icon mặc định
    }
  };

  // Sửa lại hàm addSocialLink để sử dụng tên platform từ SOCIAL_PLATFORMS
  const addSocialLink = async () => {
    if (!newPlatform || !newUrl || !company._id) return;
    setIsLoading(true);

    try {
      const platformName = SOCIAL_PLATFORMS[newPlatform].name;

      // Tạo object mới cho socialLinks
      const updatedSocialLinks = {
        ...company.socialLinks,
        [newPlatform]: newUrl,
      };

      const response = await fetch(`/api/company/${company._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialLinks: updatedSocialLinks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update social links");
      }

      // Cập nhật state local
      setSocialLinks((prev) => [
        ...prev,
        { platform: platformName, url: newUrl },
      ]);

      // Reset form
      setNewPlatform("");
      setNewUrl("");

      toast.success("Social link added successfully!");
    } catch (error) {
      console.error("Error adding social link:", error);
      toast.error("Failed to add social link");
    } finally {
      setIsLoading(false);
    }
  };

  // Sửa lại hàm removeSocialLink để cập nhật trực tiếp vào database
  const removeSocialLink = async (index) => {
    try {
      const linkToRemove = socialLinks[index];

      // Tạo object mới cho socialLinks, set giá trị về null
      const updatedSocialLinks = {
        ...company.socialLinks,
        [linkToRemove.platform.toLowerCase()]: null,
      };

      // Gọi API để cập nhật
      const response = await fetch(`/api/company/${company._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialLinks: updatedSocialLinks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove social link");
      }

      // Cập nhật state local
      setSocialLinks((prev) => prev.filter((_, i) => i !== index));

      // Hiển thị thông báo thành công
      toast.success("Social link removed successfully!");
    } catch (error) {
      console.error("Error removing social link:", error);
      toast.error("Failed to remove social link");
    }
  };

  return (
    <main className="mx-auto h-screen w-screen flex overflow-hidden">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full px-10 pt-5 h-full overflow-y-auto">
        <HeaderCompany />
        <div className="w-full mx-auto py-7">
          {/* Header Section */}
          <header className="bg-white rounded-2xl shadow-sm mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              SOCIAL MEDIA LINKS
            </h1>
            <p className="text-gray-500">
              Manage your company's social media presence
            </p>
            <nav className="flex mt-6 space-x-1 bg-gray-100 p-1 rounded-xl">
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600"
                onClick={() => router.push("/company/Settings")}
              >
                Overview
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-white text-blue-600 shadow-sm">
                Social Links
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600"
                onClick={() => router.push("/company/CompanyTeam")}
              >
                Team
              </button>
            </nav>
          </header>

          {/* Social Links Management Section */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Manage Social Links
            </h3>
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border"
                >
                  <div className="flex items-center space-x-3">
                    {/* Hiển thị icon theo tên mạng xã hội */}
                    {getSocialIcon(link.platform)}
                    <div>
                      <p className="text-gray-800 font-medium">
                        {link.platform}
                      </p>
                      <a
                        href={link.url}
                        target="_blank"
                        className="text-blue-500 text-sm"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Add New Social Link */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border">
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Select Platform</option>
                  {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => {
                    // Kiểm tra xem platform này đã có trong socialLinks chưa
                    const isExisting = socialLinks.some(
                      (link) =>
                        link.platform.toLowerCase() === key.toLowerCase()
                    );

                    // Chỉ hiển thị option nếu platform chưa được thêm
                    if (!isExisting) {
                      return (
                        <option key={key} value={key}>
                          {platform.name}
                        </option>
                      );
                    }
                    return null;
                  })}
                </select>

                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={
                    newPlatform
                      ? SOCIAL_PLATFORMS[newPlatform]?.placeholder
                      : "Enter URL"
                  }
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />

                <button
                  onClick={addSocialLink}
                  disabled={!newPlatform || !newUrl || isLoading}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    "Adding..."
                  ) : (
                    <div>
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Add Link
                    </div>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SocialsLink;
