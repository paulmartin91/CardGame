import React, { useEffect, useState } from 'react';

import {PlayerArea, CardsArea} from '../Components/Table/index'

function TableContainer({hands, select, playCard, username}) {

    return (
        <div className="w-75 m-5 p-5 bg-success border d-flex flex-column justify-content-between align-items-center" style={styles.container}>
            {Object.keys(hands).map(name =>
                {
                    console.log(hands[name] !== username)
                    return name !== username && name != 'openPlay' && <PlayerArea open={hands[name].open} blind={hands[name].blind} player={name}/>}
            )}
            <CardsArea 
                cards={hands.openPlay}
                select={select} 
                playCard={playCard} 
                handArea={'openPlay'}
            />
            <PlayerArea 
                open={hands[username].open} 
                blind={hands[username].blind} 
                select={select} 
                player={username} 
                username={username} 
                playCard={playCard}
            />                
        </div>
    );
}

const styles = {
    container: {
        borderRadius: 100,
        height: 700,
    }
}

export default TableContainer;