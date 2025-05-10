import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";

const ProfileForm = () => {
  return (
    <div className="space-y-4 pl-5">
      <div className="border-b-2 gray-500 pb-5">
        <h2 className="text-xl font-semibold ">Basic Information</h2>
        <p className="text-gray-500 text-sm mt-1">
          This is your personal information that you can update anytime.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div style={{ flex: 1 }}>
            <h3 className="text-sm font-medium mb-2">Profile Photo</h3>
            <p className="text-gray-500 text-sm mb-4">
              This image will be shown publicly as your profile picture, it will
              help recruiters recognize you!
            </p>
          </div>

          <div
            className="flex items-center space-x-6 self-center pl-20"
            style={{ flex: 3 }}
          >
            <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
              <img
                src="/api/placeholder/96/96"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center ml-36 pr-20">
              <ImagePlus className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-sm text-center">
                <span className="text-blue-600">Click to replace</span> or drag
                and drop
                <p className="text-gray-500 mt-1">
                  SVG, PNG, JPG or GIF (max. 400 x 400px)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 w-full justify-between">
          <div className="w-full flex justify-between  border-b-2 gray-500 pb-3">
            <h3
              className="text-sm font-medium justify-start"
              style={{ flex: 1 }}
            >
              Personal Details
            </h3>

            <div className="flex flex-col flex-wrap" style={{ flex: 3 }}>
              <div className="w-full space-y-2 flex flex-col mb-6">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="This is placeholder"
                  className="w-3/4 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div
                className="grid grid-cols-2 md:grid-cols-2 gap-4 flex-wrap"
                style={{ flex: 3 }}
              >
                <div className="space-y-2 w-full">
                  <Label
                    htmlFor="email"
                    className="self-center text-sm font-semibold"
                  >
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    placeholder="This is placeholder"
                    className="w-3/4 p-2 border border-gray-300 rounded-lg ml-4"
                  />
                </div>

                <div className="space-y-2 flex justify-center ">
                  <Label
                    htmlFor="phone"
                    className="self-center text-sm font-semibold"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="This is placeholder"
                    className="w-3/4 p-2 border border-gray-300 rounded-lg ml-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="self-center text-sm font-semibold"
                  >
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="gender"
                    placeholder="This is placeholder"
                    className="w-3/4 p-2 border border-gray-300 rounded-lg ml-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dob"
                    placeholder="This is placeholder"
                    className="w-3/4 p-2 border border-gray-300 rounded-lg ml-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex justify-between">
            <div style={{ flex: 1 }}>
              <h3 className="text-sm font-medium">Account Type</h3>
              <p className="text-gray-500 text-sm">
                You can update your account type
              </p>
            </div>

            <RadioGroup
              defaultValue="job-seeker"
              className="space-y-3"
              style={{ flex: 3 }}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="job-seeker"
                  id="job-seeker"
                  className="h-6 w-6"
                />
                <div>
                  <Label htmlFor="job-seeker" className="font-medium">
                    Job Seeker
                  </Label>
                  <p className="text-gray-500 text-sm">Looking for a job</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="employer"
                  id="employer"
                  className="h-6 w-6"
                />
                <div>
                  <Label htmlFor="employer" className="font-medium">
                    Employer
                  </Label>
                  <p className="text-gray-500 text-sm">
                    Hiring, sourcing candidates, or posting a jobs
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
