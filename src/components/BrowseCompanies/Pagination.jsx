"use client";

import { Button } from "@/components/ui/button";
import {
    FiChevronsLeft,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsRight,
} from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        const showEllipsisBefore = currentPage > 3;
        const showEllipsisAfter = currentPage < totalPages - 2;
        pages.push(1);
        if (showEllipsisBefore) pages.push("...");
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        if (showEllipsisAfter) pages.push("...");
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-2">
            {/* First Page Button */}
            <Button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-full transition-colors duration-200"
            >
                <FiChevronsLeft size={20} />
            </Button>

            {/* Previous Page Button */}
            <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-full transition-colors duration-200"
            >
                <FiChevronLeft size={20} />
            </Button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => (
                <Button
                    key={index}
                    onClick={() => page !== "..." && handlePageChange(page)}
                    disabled={page === "..."}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${currentPage === page
                            ? "bg-indigo-600 text-white"
                            : page === "..."
                                ? "bg-transparent text-gray-600 cursor-default"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    {page}
                </Button>
            ))}

            {/* Next Page Button */}
            <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-full transition-colors duration-200"
            >
                <FiChevronRight size={20} />
            </Button>

            {/* Last Page Button */}
            <Button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-full transition-colors duration-200"
            >
                <FiChevronsRight size={20} />
            </Button>
        </div>
    );
};

export default Pagination;