import React from 'react';

import CardsArea from './CardsArea'

function PlayerArea({open, blind, player, select, playCard, username}) {
    return (
        <div className="border h-50 w-50">
            {player == username ?
                <>
                    <CardsArea cards={open} select={select} playCard={playCard} handArea={'open'} player={player} />
                    <CardsArea cards={blind} select={select} playCard={playCard} handArea={'blind'} player={player}/>
                </>
            :
                <>
                    <CardsArea cards={blind} player={player}/>
                    <CardsArea cards={open} player={player}/>
                </>
            }
        </div>
    );
}

export default PlayerArea;