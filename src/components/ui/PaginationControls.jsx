import React from "react";

export const PaginationControls = ({ pagination, onPageChange }) => {
  if (!pagination || !pagination.current_page) {
    return null;
  }

  const getPageNumbers = (currentPage, totalPages) => {
    const numbers = [];
    numbers.push(1);

    if (currentPage > 3) {
      numbers.push("...");
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      numbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      numbers.push("...");
    }

    if (totalPages > 1) {
      numbers.push(totalPages);
    }

    return numbers;
  };

  const pageNumbers = getPageNumbers(
    pagination.current_page,
    pagination.total_pages
  );

  const baseButtonStyles =
    "rounded-md transition-smooth active-scale cursor-pointer";
  const inactiveButtonStyles =
    "outline outline-[1px] outline-gray-300 dark:outline-dark-border shadow-input";
  const numberButtonStyles = "w-8 h-8 flex items-center justify-center";
  const navButtonStyles = "px-4 h-8 flex items-center justify-center";

  return (
    <div className="flex items-center gap-2">
      {pagination.has_prev_page && (
        <button
          onClick={() => onPageChange(pagination.current_page - 1)}
          className={`${baseButtonStyles} ${navButtonStyles} ${inactiveButtonStyles} btn-dark-secondary hover:surface-hover`}
        >
          « Previous
        </button>
      )}

      {pageNumbers.map((pageNum, index) => (
        <React.Fragment key={index}>
          {pageNum === "..." ? (
            <span className="px-2 text-tertiary">...</span>
          ) : (
            <button
              onClick={() => onPageChange(pageNum)}
              className={`${baseButtonStyles} ${numberButtonStyles} ${
                pagination.current_page === pageNum
                  ? `${inactiveButtonStyles} btn-dark`
                  : `${inactiveButtonStyles} btn-dark-secondary hover:surface-hover`
              }`}
            >
              {pageNum}
            </button>
          )}
        </React.Fragment>
      ))}

      {pagination.has_next_page && (
        <button
          onClick={() => onPageChange(pagination.current_page + 1)}
          className={`${baseButtonStyles} ${navButtonStyles} hover:surface-hover`}
        >
          Next »
        </button>
      )}
    </div>
  );
};

export default PaginationControls;
