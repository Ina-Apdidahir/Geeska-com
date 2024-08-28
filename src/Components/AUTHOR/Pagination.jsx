import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({
    postsPerPage,
    totalPosts,
    paginate,
    currentPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
}) => {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const handleClick = (e, pageNumber) => {
        e.preventDefault();
        paginate(pageNumber);
    };

    return (
        <nav className={styles.paginationContainer}>
            <div className={styles.icons}>
                {/* First Page */}
                {currentPage > 1 && (
                    <svg
                        className={styles.paginationIcon}
                        onClick={firstPage}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M4.83578 12L11.0429 18.2071L12.4571 16.7929L7.66421 12L12.4571 7.20712L11.0429 5.79291L4.83578 12ZM10.4857 12L16.6928 18.2071L18.107 16.7929L13.3141 12L18.107 7.20712L16.6928 5.79291L10.4857 12Z"></path>
                    </svg>
                )}
                {/* Previous Page */}
                {currentPage > 1 && (
                    <svg
                        className={styles.paginationIcon}
                        onClick={prevPage}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
                    </svg>
                )}
            </div>

            <ul className={styles.pagination}>
                {/* Show dots if there's a gap between first page and startPage */}
                {currentPage > 2 && (
                    <>
                        <li className={styles.StartingPage} >
                            <a href="" onClick={(e) => handleClick(e, 1)}>1</a>
                        </li>
                        {currentPage > 3 && <li className={styles.dots}>...</li>}
                    </>
                )}

                {/* Previous Page (if exists) */}
                {currentPage > 1 && (
                    <li>
                        <a href="" onClick={(e) => handleClick(e, currentPage - 1)}>{currentPage - 1}</a>
                    </li>
                )}

                {/* Current Page */}
                <li className={styles.active}>
                    <a href="" onClick={(e) => handleClick(e, currentPage)}>{currentPage}</a>
                </li>

                {/* Next Page (if exists) */}
                {currentPage < totalPages && (
                    <li>
                        <a href="" onClick={(e) => handleClick(e, currentPage + 1)}>{currentPage + 1}</a>
                    </li>
                )}

                {/* Show dots if there's a gap between endPage and last page */}
                {currentPage < totalPages - 1 && (
                    <>
                        {currentPage < totalPages - 2 && <li className={styles.dots}>...</li>}
                        <li className={styles.EndingPage} >
                            <a href="" onClick={(e) => handleClick(e, totalPages)}>{totalPages}</a>
                        </li>
                    </>
                )}
            </ul>

            <div className={styles.icons}>
                {/* Next Page */}
                {currentPage < totalPages && (
                    <svg
                        className={styles.paginationIcon}
                        onClick={nextPage}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                    </svg>
                )}
                {/* Last Page */}
                {currentPage < totalPages && (
                    <svg
                        className={styles.paginationIcon}
                        onClick={lastPage}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path>
                    </svg>
                )}
            </div>
        </nav>
    );
};

export default Pagination;
