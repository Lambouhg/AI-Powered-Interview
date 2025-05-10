"use client";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mt-4 flex justify-center items-center gap-4 fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${currentPage === 1
          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        {totalPages > 3 ? (
          <>
            {/* First page */}
            <button
              onClick={() => onPageChange(1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
            >
              1
            </button>

            {/* Show dots or page numbers */}
            {currentPage > 2 && <span className="text-gray-500">...</span>}

            {/* Current page when not first or last */}
            {currentPage !== 1 && currentPage !== totalPages && (
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
                {currentPage}
              </button>
            )}

            {/* Show dots before last page */}
            {currentPage < totalPages - 1 && (
              <span className="text-gray-500">...</span>
            )}

            {/* Last page */}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === totalPages
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
            >
              {totalPages}
            </button>
          </>
        ) : (
          // If 2 pages or less, show all page numbers
          [...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
            >
              {index + 1}
            </button>
          ))
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${currentPage === totalPages
          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default Pagination;
