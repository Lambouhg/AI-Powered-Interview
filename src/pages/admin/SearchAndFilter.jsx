"use client";

function SearchAndFilter({ roleFilter, setRoleFilter, usersPerPage, setUsersPerPage, setSearchTerm, setCurrentPage }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-300">List of users:</h2>
      <div className="flex items-center gap-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 hover:bg-gray-600 transition-colors"
        >
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="company">Company</option>
        </select>

        <select
          value={usersPerPage}
          onChange={(e) => {
            setUsersPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
          className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 hover:bg-gray-600 transition-colors"
        >
          <option value={3}>3 Account</option>
          <option value={5}>5 Account</option>
          <option value={10}>10 Account</option>
        </select>

        <input
          type="text"
          placeholder="Search by email or name..."
          className="w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchAndFilter;