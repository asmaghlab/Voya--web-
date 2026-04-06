type PaginationProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      {/* Prev Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className={`px-6 py-2 rounded-lg border-2 font-medium transition-all
          ${
            currentPage === 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed bg-white"
              : "border-gray-800 text-gray-800 hover:bg-gray-100"
          }`}
      >
        Prev
      </button>
      
      {/* Current Page / Total Pages */}
      <div className="px-5 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg">
        {currentPage} / {totalPages}
      </div>
      
      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className={`px-6 py-2 rounded-lg border-2 font-medium transition-all
          ${
            currentPage === totalPages
              ? "border-gray-300 text-gray-400 cursor-not-allowed bg-white"
              : "border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
      >
        Next
      </button>
    </div>
  );
};