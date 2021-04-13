import React, {useState} from 'react';
import Pagination from './pagination'
import paginate from '../../utils/paginate'
import GameListTable from './GameListTable';
import _ from 'lodash'

function ListOfGames({gameList, handleSubmit, gameRefresh}) {

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(8)
    const [showPassword, setShowPassword] = useState(true)
    const [sortColumn, setSortColumn] = useState({path: 'title', order: 'asc'})

    const filtered = showPassword ? gameList : gameList.filter(({password}) => !password)
    
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

    const games = paginate(sorted, currentPage, pageSize)

    const handlePageChange = page => setCurrentPage(page)

    const handleSort = path => {
        let tempPath = {...sortColumn}
        if (path === tempPath.path)
            tempPath.order = tempPath.order == 'asc' ? 'desc' : 'asc'
        else 
            tempPath = {path, order: 'asc'}
        setSortColumn(tempPath)
    }

    const renderSortIcon = column => {
        if (column !== sortColumn.path) return null
        if (sortColumn.order == 'asc') return <i className="fa fa-sort-asc"></i>
        return <i className="fa fa-sort-desc"></i>

    }

    return (
        <div className="col card m-2 d-flex justify-content-between" style={{minHeight: 650}}>
            <GameListTable
                gameRefresh = {gameRefresh}
                currentPage={currentPage}
                sorted={sorted}
                pageSize={pageSize}
                games={games}
                setShowPassword={setShowPassword}
                showPassword={showPassword}
                handleSubmit={handleSubmit}
                onSort={handleSort}
                renderSortIcon={renderSortIcon}
            />
            <Pagination 
                itemsCount={gameList.length} 
                pageSize={pageSize} 
                onPageChange={handlePageChange} 
                currentPage={currentPage}
            />
        </div>
    );
}

export default ListOfGames;