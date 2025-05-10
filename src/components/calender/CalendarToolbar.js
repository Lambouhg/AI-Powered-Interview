import React from "react";

const CalendarToolbar = ({ onNavigate, onView, label, view }) => {
  if (!onNavigate || !onView) {
    console.error("Missing required props: onNavigate or onView");
    return null;
  }

  const goToBack = () => {
    onNavigate("PREV"); // Sửa "PREVIOUS" thành "PREV"
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToCurrent = () => {
    onNavigate("TODAY");
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={goToCurrent}
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
        >
          Today
        </button>
        <button
          type="button"
          onClick={goToBack}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
        >
          Next
        </button>
      </div>

      <h3 className="text-lg font-medium">{label || "Calendar"}</h3>

      <div className="flex items-center space-x-2">
        {["month", "week", "day"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              onView(key);
            }}
            className={`px-3 py-1 rounded-md text-sm ${
              view === key
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarToolbar;
