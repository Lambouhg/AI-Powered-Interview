import { useRouter } from "next/router";
import img from "../../assets/image.png";
const CompanyCards = ({ companies }) => {
  const router = useRouter();

  const handleImageError = (e) => {
    e.target.src = { img };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => (
        <div
          key={company._id}
          className="shadow-md rounded-lg hover:shadow-lg transition duration-200 border border-gray-200 cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push(`/CompaniesDetail?companyId=${company._id}`)
          }
        >
          <div className="relative p-4">
            <p className="absolute top-2 right-2 text-xs text-blue-600 font-medium">
              {company.jobsCount || 0} jobs
            </p>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <img
                src={company.logo || { img }}
                className="w-full h-full object-cover rounded-full"
                alt={company.name}
                onError={handleImageError}
              />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {company.name}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-6">
              {company.description}
            </p>
            <div className="flex mt-2 gap-2 flex-wrap">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {company.industry || "Full-Time"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyCards;
