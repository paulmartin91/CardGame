import React from 'react';
import PropTypes from 'prop-types'
import _ from 'lodash'

const Pagination = ({itemsCount, pageSize, onPageChange, currentPage}) => {

    const pagesCount = itemsCount / pageSize
    if (pagesCount <= 1) return null
    const pages = _.range(1, pagesCount + 1)
    
    return (
        <nav style={styles.clickable} >
            <ul className="pagination">
                {pages.map(page => 
                    <li className={currentPage == page ? 'page-item active' : 'page-item'} key={page}>
                        <a className="page-link" onClick={() => onPageChange(page)}>{page}</a>
                    </li> 
                )}
            </ul>
        </nav>
    )
}

Pagination.propTypes = {
    itemsCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

const styles = {
    clickable: {
        cursor: 'pointer'
    }
}
 
export default Pagination;