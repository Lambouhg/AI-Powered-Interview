import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
function HeaderCompany() {
  const { user } = useUser();
  const router = useRouter();
  const toPostJob = () => {
    router.push("/company/PostJobCompany");
  };
  const toCompanyCreate = () => {
    router.push("/company/CreateCompany");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold">Good morning, {user?.firstName}</h2>
        <p className="text-gray-600">
          Here is your job listings statistic report.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          onClick={toCompanyCreate}
        >
          + Create Company
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          onClick={toPostJob}
        >
          + Create Job
        </button>
      </div>
    </div>
  );
}

export default HeaderCompany;
