import React from 'react';

import CardsArea from './CardsArea'

function PlayerArea({open, blind, player, select, playCard, username}) {

    return (
        <div className="border h-50 w-50">
            {player == 0 ?
                <>
                    <CardsArea cards={open} select={select} playCard={playCard} handArea={'open'} />
                    <CardsArea cards={blind} select={select} playCard={playCard} handArea={'blind'} />
                </>
            :
                <>
                    <CardsArea cards={blind} />
                    <CardsArea cards={open} />
                </>
            }
        </div>
    );
}

export default PlayerArea;