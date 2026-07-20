import styles from "./styles.module.css"

interface PaginationProps {
  currentPage: number
  hasNextPage: boolean
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  marginTop_size?: string
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasNextPage,
  setCurrentPage,
  marginTop_size = "0px",
}) => {
  const nextPage = (): void => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const previousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  if (currentPage === 1 && !hasNextPage) {
    return null
  }

  return (
    <div className={styles.pagination} style={{ marginTop: marginTop_size }}>
      <button
        onClick={previousPage}
        disabled={currentPage === 1}
        title="Página anterior"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      <span className={styles.currentPage}>
        {currentPage}
      </span>

      <button
        onClick={nextPage}
        disabled={!hasNextPage}
        title="Próxima página"
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  )
}

export default Pagination