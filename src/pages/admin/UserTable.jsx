"use client";

function UserTable({ users, onRoleChange }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg table-fixed">
        <thead className="bg-gray-700 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left text-gray-300 font-semibold w-1/3">Email</th>
            <th className="px-4 py-2 text-left text-gray-300 font-semibold w-1/4">Name</th>
            <th className="px-4 py-2 text-left text-gray-300 font-semibold w-1/6">Role</th>
            <th className="px-4 py-2 text-left text-gray-300 font-semibold w-1/6">Action</th>
          </tr>
        </thead>
        <tbody>
          {users && Array.isArray(users) ? (
            users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-2 text-gray-400 truncate">{user.email}</td>
                <td className="px-4 py-2 text-gray-400 truncate">{user.name}</td>
                <td className="px-4 py-2 text-gray-400">{user.role}</td>
                <td className="px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user._id, e.target.value)}
                    className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="company">Company</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 text-gray-400 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}

export default UserTable;