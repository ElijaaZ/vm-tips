import "../index.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  startIndex,
  visibleCount,
  totalCount,
}) => {
  return (
    <div className="pagination">
      <button onClick={onPrevious} disabled={currentPage === 1}>
        Föregående
      </button>
      <span>
        {startIndex + 1}-{startIndex + visibleCount} av {totalCount}
      </span>
      <button onClick={onNext} disabled={currentPage === totalPages}>
        Nästa
      </button>
    </div>
  );
};

export default Pagination;
