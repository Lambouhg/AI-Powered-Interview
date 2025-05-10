"use client";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { motion } from "framer-motion";
import {
  neumorphicCard,
  neumorphicButton,
  gradientText,
} from "../../components/calender/NeumorphicStyles";
import SidebarCompany from "../../components/SidebarCompany";
import DasborderHeader from "../../components/HeaderCompany";
import EventForm from "../../components/calender/EventForm";
import EventModal from "../../components/calender/EventModal";
import CalendarToolbar from "../../components/calender/CalendarToolbar";

const localizer = momentLocalizer(moment);

const AVAILABLE_TIME_SLOTS = [
  { label: "8:00 AM", value: "08:00:00" },
  { label: "9:00 AM", value: "09:00:00" },
  { label: "10:00 AM", value: "10:00:00" },
  { label: "2:00 PM", value: "14:00:00" },
  { label: "3:00 PM", value: "15:00:00" },
  { label: "4:00 PM", value: "16:00:00" },
];

// Component Dialog không thay đổi, giữ nguyên
const Dialog = ({ type, message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  const dialogVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={dialogVariants}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
    >
      <div className={`${neumorphicCard} max-w-md w-full`}>
        <div className="flex items-center mb-4">
          {type === "success" && (
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {type === "error" && (
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
          {type === "info" && (
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
          {type === "warning" && (
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          )}
          <h3 className={`ml-3 text-lg font-medium ${gradientText}`}>
            {type === "success" && "Sucess"}
            {type === "error" && "Error"}
            {type === "warning" && "Confirm"}
            {type === "info" && "Notification"}
          </h3>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end space-x-3">
          {onCancel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className={neumorphicButton}
            >
              Cancel
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className={`${neumorphicButton} ${
              type === "warning"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                : type === "error"
                ? "bg-gradient-to-r from-red-400 to-red-600 text-white"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            }`}
          >
            {onCancel ? "Save" : "Close"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const CalendarApp = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [applyUserName, setApplyUserName] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: "info",
    message: "",
    onConfirm: () => {},
    onCancel: null,
  });

  const [formValues, setFormValues] = useState({
    jobID: "",
    companyID: "",
    userID: "",
    applicantID: "",
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchAplly();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const userData = JSON.parse(storedUser);
      const res = await axios.get(`/api/calender`, {
        params: { companyId: userData.companyId },
      });

      if (res.data && res.data.length > 0) {
        const formattedEvents = res.data.map((event) => ({
          ...event,
          id: event._id, // Đảm bảo có id duy nhất
          start: new Date(event.date + "T" + event.time),
          end: new Date(
            new Date(event.date + "T" + event.time).getTime() + 60 * 60 * 1000
          ),
        }));
        setEvents(formattedEvents);
      } else {
        setEvents([]); // Đặt `events` thành mảng rỗng nếu không có dữ liệu
        setError("No events found."); // Đặt thông báo lỗi
      }
    } catch (err) {
      setError("Unable to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAplly = async () => {
    const storedUser = localStorage.getItem("user");
    const userData = JSON.parse(storedUser);
    if (!userData.companyId) {
      setError("Company ID is not available.");
      setDialog({
        isOpen: true,
        type: "error",
        message: "Company ID is not available.",
        onConfirm: () => setDialog({ ...dialog, isOpen: false }),
        onCancel: null,
      });
      return;
    }
    const res = await axios.get(`/api/company/applicant/applyStatusCompany`, {
      params: { companyId: userData.companyId },
    });
    if (res.data) {
      setApplyUserName(res.data);
    }
  };

  const handleSelectSlot = ({ start }) => {
    const selectedDate = moment(start).format("YYYY-MM-DD");
    setFormValues({ ...formValues, date: selectedDate, time: "" });
    setSelectedSlot({ start });
    setIsFormOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();

    if (!formValues.time) {
      setDialog({
        isOpen: true,
        type: "warning",
        message: "Vui lòng chọn thời gian cho sự kiện.",
        onConfirm: () => setDialog({ ...dialog, isOpen: false }),
        onCancel: null,
      });
      return;
    }

    try {
      const newEvent = { ...formValues };
      const response = await axios.post("/api/calender/", newEvent);
      const createdEvent = {
        ...response.data,
        id: response.data._id, // Đảm bảo id được gán
        start: new Date(formValues.date + "T" + formValues.time),
        end: new Date(
          new Date(formValues.date + "T" + formValues.time).getTime() +
            60 * 60 * 1000
        ),
      };

      setEvents((prevEvents) => [...prevEvents, createdEvent]);
      setDate(new Date(formValues.date)); // Đồng bộ date với ngày của sự kiện mới
      setIsFormOpen(false);
      setFormValues({
        jobID: "",
        companyID: "",
        userID: "",
        applicantID: "",
        title: "",
        description: "",
        location: "",
        date: "",
        time: "",
      });

      setDialog({
        isOpen: true,
        type: "success",
        message: "The event was successfully created!",
        onConfirm: () => setDialog({ ...dialog, isOpen: false }),
        onCancel: null,
      });
    } catch (err) {
      setError("Unable to create events");
      setDialog({
        isOpen: true,
        type: "error",
        message: "Unable to create events",
        onConfirm: () => setDialog({ ...dialog, isOpen: false }),
        onCancel: null,
      });
    }
  };

  const handleUpdateEvent = async (updatedData) => {
    try {
      await axios.put(`/api/calender/`, {
        id: selectedEvent._id,
        updatedEvent: updatedData,
      });

      setEvents((prevEvents) =>
        prevEvents.map(
          (evt) =>
            evt.id === selectedEvent._id ? { ...evt, ...updatedData } : evt // Sử dụng _id để khớp
        )
      );

      setIsModalOpen(false);
      setDialog({
        isOpen: true,
        type: "success",
        message: "The event has been successfully updated!",
        onConfirm: () => setDialog({ ...dialog, isOpen: false }),
        onCancel: null,
      });
    } catch (err) {
      setError("Unable to update the event.");
      setDialog({
        isOpen: true,
        type: "error",
        message: "Unable to update the event.",
        onConfirm: () => setDialog({ ...dialog, isOpen: false }),
        onCancel: null,
      });
    }
  };

  const handleDeleteEvent = async () => {
    setDialog({
      isOpen: true,
      type: "warning",
      message: "Are you sure to delete this event?",
      onConfirm: async () => {
        try {
          await axios.delete(`/api/calender/`, {
            data: { idCalender: selectedEvent._id },
          });
          setEvents((prevEvents) =>
            prevEvents.filter((evt) => evt.id !== selectedEvent._id)
          );
          setIsModalOpen(false);
          setDialog({
            isOpen: true,
            type: "success",
            message: "The event was successfully erased!",
            onConfirm: () => setDialog({ ...dialog, isOpen: false }),
            onCancel: null,
          });
        } catch (err) {
          setError("Unable to delete the event.");
          setDialog({
            isOpen: true,
            type: "error",
            message: "Unable to delete the event.",
            onConfirm: () => setDialog({ ...dialog, isOpen: false }),
            onCancel: null,
          });
        }
      },
      onCancel: () => setDialog({ ...dialog, isOpen: false }),
    });
  };

  const isTimeSlotBooked = (date, time) => {
    return events.some(
      (event) =>
        moment(event.start).format("YYYY-MM-DD") === date &&
        moment(event.start).format("HH:mm:ss") === time
    );
  };

  const getAvailableTimeSlots = () => {
    if (!formValues.date) return [];
    return AVAILABLE_TIME_SLOTS.map((slot) => ({
      ...slot,
      disabled: isTimeSlotBooked(formValues.date, slot.value),
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="overflow-y-auto w-full p-8">
        <DasborderHeader />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-6"
        >
          <div className="gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${neumorphicButton} flex items-center gap-2 mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white`}
              onClick={() => {
                setFormValues({
                  jobID: "",
                  companyID: "",
                  userID: "",
                  applicantID: "",
                  title: "",
                  description: "",
                  location: "",
                  date: moment().format("YYYY-MM-DD"),
                  time: "",
                });
                setIsFormOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <span>Create Event</span>
            </motion.button>

            <div className={neumorphicCard}>
              <h1 className={`text-2xl font-bold mb-6 ${gradientText}`}>
                Interview schedule
              </h1>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-4 border-t-indigo-500 border-gray-200 rounded-full"
                  />
                </div>
              ) : events.length === 0 ? ( // Kiểm tra nếu không có sự kiện
                <h2 className="text-center text-gray-500 text-lg">
                  No events available.
                </h2>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  selectable
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  views={["month", "week", "day"]}
                  view={view}
                  date={date}
                  onNavigate={(newDate) => setDate(newDate)}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  components={{
                    toolbar: (props) => (
                      <CalendarToolbar
                        {...props}
                        view={view}
                        onView={setView}
                      />
                    ),
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>

        {isFormOpen && (
          <EventForm
            formValues={formValues}
            setFormValues={setFormValues}
            availableTimeSlots={getAvailableTimeSlots()}
            onSubmit={handleCreateEvent}
            applicants={applyUserName.applicants}
            onClose={() => setIsFormOpen(false)}
          />
        )}

        {isModalOpen && selectedEvent && (
          <EventModal
            event={selectedEvent}
            onUpdate={handleUpdateEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <Dialog
          isOpen={dialog.isOpen}
          type={dialog.type}
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onCancel={dialog.onCancel}
        />
      </div>
    </div>
  );
};

export default CalendarApp;
