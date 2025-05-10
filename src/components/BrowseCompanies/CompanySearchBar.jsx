const CompanySearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Job title or keyword"
                className="flex-1 bg-[#E9E9E9FF] p-4 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="text-md text-gray-500">
                Popular: Twitter, Microsoft, Apple, Facebook
            </div>
        </div>
    );
};

export default CompanySearchBar;