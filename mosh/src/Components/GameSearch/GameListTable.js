import React, { useEffect } from 'react';

function GameListTable({ games, showPassword, setShowPassword, handleSubmit, onSort, renderSortIcon, gameRefresh }) {
  return (
    <>
     {/* <button className="btn" style={{fontSize: "1.5em", width: 20, height: 20, left: -10, top: -12, position: "absolute", zIndex: 2}} onClick={() => console.log('refresh')}>⟳</button> */}
      {/* //socket.emit('request refresh games')}>⟳</button> */}
      <table className="table mt-3">
          <thead >
              <tr>
                  <th className="w-25" style={styles.clickable} onClick={() => onSort('name')} scope="col">Game Name {renderSortIcon('name')} </th>
                  <th style={styles.clickable} onClick={() => onSort('players')} scope="col">Players {renderSortIcon('currentPlayers')}</th>
                  <th style={styles.clickable} scope="col" className="d-flex justify-content-end align-items-center">
                      <a className="mr-5" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? "Hide " : "Show "} Passwords
                      </a>
                      <button className="btn btn-primary" onClick={gameRefresh}>⟳</button>
                  </th>
              </tr>
          </thead>
          <tbody>
          {games.map(({name, players, maxPlayers, password}) => 
              <tr key={name}>
                  <td scope="row">{name}</td>
                  <td>
                      <span className={Object.keys(players).length == maxPlayers ? "ml-3 badge badge-danger badge-pill" : "ml-3 badge badge-primary badge-pill"}>{Object.keys(players).length}/{maxPlayers}</span>
                  </td>
                  <td colSpan="2" className="d-flex justify-content-end">
                      <form className="input-group d-flex justify-content-end w-75" name='join-game' onSubmit={ event => handleSubmit(event, name)}>
                          {password && 
                              <input name="password" type="password" className="form-control" placeholder="Password" required />
                          }
                          <div className={password ? "input-group-append" : ""}>
                              <button className="btn btn-primary" type="submit">Join</button>
                          </div>
                      </form>
                  </td>
              </tr>
          )}
          </tbody>
      </table> 
    </>
  );
}

const styles = {
    clickable: {
        cursor: 'pointer'
    }
}

export default GameListTable;