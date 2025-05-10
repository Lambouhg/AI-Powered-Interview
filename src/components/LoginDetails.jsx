import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
const LoginDetails = () => {
  return (
    <div className="space-y-8 w-full">
      <div className="mb-6 w-full border-b-2 gray-500">
        <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
        <p className="text-gray-600 text-sm mb-6">
          This is login information that you can update anytime.
        </p>
      </div>

      {/* Email Update Section */}
      <div className="mb-8">
        <div className="flex w-full justify-between">
          <div style={{ flex: 2 }}>
            <h3 className="font-medium mb-1">Update Email</h3>
            <p className="text-gray-600 text-sm">
              Update your email address to make sure it is safe
            </p>
          </div>
          <div className="flex flex-col" style={{ flex: 3 }}>
            <div>
              <span className="text-gray-600 mr-2">jakegyll@email.com</span>
              <p className="text-sm text-gray-500 mb-2 mt-1">
                Your email address is verified.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <h4 className="font-medium mb-2">Update Email</h4>
              <div className="space-y-4 flex flex-col">
                <Input
                  type="email"
                  placeholder="Enter your new email"
                  className="w-full max-w-md p-2 rounded-sm "
                />
                <Button className="bg-blue-600 text-white px-4 py-2 rounded w-1/6 hover:bg-blue-800 text-sm">
                  Update Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Update Section */}
      <div className="mb-8 flex">
        <div
          className="flex justify-between items-start mb-2"
          style={{ flex: 2 }}
        >
          <div>
            <h3 className="font-medium mb-1">New Password</h3>
            <p className="text-gray-600 text-sm">
              Manage your password to make sure it is safe
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4" style={{ flex: 3 }}>
          <div>
            <h4 className="font-medium mb-2">Old Password</h4>
            <Input
              type="password"
              placeholder="Enter your old password"
              className="w-full max-w-md"
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">New Password</h4>
            <Input
              type="password"
              placeholder="Enter your new password"
              className="w-full max-w-md"
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <Button className="bg-blue-600 text-white px-4 py-2 rounded">
            Change Password
          </Button>
        </div>
      </div>

      {/* Close Account Section */}
      <div className="flex justify-end">
        <button className="text-red-500 flex items-center">
          Close Account
          <Info className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default LoginDetails;
