import Siderbar from "../components/Sidebar";
import FindJobDetail from "./FindJobDetail";


const JobDetail = () => {


  return (
    <div className="flex min-h-screen bg-gray-100 font-sans w-full h-screen overflow-hidden">
      {/* Sidebar */}
      <Siderbar />

      {/* Main Content */}
      <FindJobDetail />
    </div>
  );
};

export default JobDetail;