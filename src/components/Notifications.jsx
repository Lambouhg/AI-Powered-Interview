import React from "react";
import { Card, CardHeader } from "@/components/ui/card";

const NotificationPreferences = () => {
  return (
    <Card className="w-full max-w-2xl p-6">
      <CardHeader className="border-b-2 border-gray-300 pb-4 gap-y-2">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p className="text-sm text-gray-500">
          This is notifications preferences that you can update anytime.
        </p>
      </CardHeader>

      <div className="space-y-6 flex ">
        <div className="text-base font-medium">
          Notifications
          <p className="text-sm font-normal text-gray-500">
            Customize your preferred notification settings
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              defaultChecked
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <div>
              <label
                htmlFor="applications"
                className="text-sm font-medium cursor-pointer"
              >
                Applications
              </label>
              <p className="text-sm text-gray-500">
                These are notifications for jobs that you have applied to
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="jobs"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <div>
              <label
                htmlFor="jobs"
                className="text-sm font-medium cursor-pointer"
              >
                Jobs
              </label>
              <p className="text-sm text-gray-500">
                These are notifications for job openings that suit your profile
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="Recommendations"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <div>
              <label
                htmlFor="recommendations"
                className="text-sm font-medium cursor-pointer"
              >
                Recommendations
              </label>
              <p className="text-sm text-gray-500">
                These are notifications for personalized recommendations from
                our recruiters
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationPreferences;
