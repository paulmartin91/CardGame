import React, { useState } from 'react';
import {DropdownButton, Dropdown} from 'react-bootstrap'

function GameTools({ hands, number, setNumber, dealCards, leaveGame, returnCard, selected, shuffleDeck }) {

    return (
        <div 
            className="d-flex justify-content-between flex-column w-75 h-25"
            style={{minWidth: 200}}
        >
            <button onClick={leaveGame} className="btn-danger rounded">Leave Game</button>
            <div className="d-flex align-items-center border p-2">
                <strong className="b">Deal</strong>
                <input 
                    type="number" 
                    value={number} 
                    onChange={({target}) => setNumber(target.value)} 
                    className="w-50 mx-2 form-control" 
                />
                <DropdownButton title={`cards to`}>
                    <Dropdown.Item
                        onClick={() => dealCards('All Players')}
                    >
                        All Players
                    </Dropdown.Item>
                    {Object.keys(hands).map(name => 
                        <Dropdown.Item
                            key={name}
                            onClick={() => dealCards(name)}
                        >
                            {name}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
            </div>
            <button 
                onClick={() => returnCard('selected')} 
                className="btn-warning rounded my-1"
                disabled={!selected}
            > Return Selected Cards
            </button>
            <button 
                onClick={() => returnCard('player')} 
                className="btn-warning rounded my-1"
            > Return All of Players Cards
            </button>
            <button 
                onClick={() => returnCard('neutral')} 
                className="btn-warning rounded my-1"
            > Return Neutral Cards
            </button>
            <button 
                onClick={shuffleDeck} 
                className="btn-success rounded my-1"
            > Shuffle Deck
            </button>
        </div>
    );
}

export default GameTools;