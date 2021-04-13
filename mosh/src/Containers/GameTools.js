import React, { useState } from 'react';
import {DropdownButton, Dropdown} from 'react-bootstrap'

function GameTools({ hands, number, setNumber, dealCards, leaveGame }) {

    return (
        <div className="d-flex justify-content-between flex-column mx-auto w-75 h-25">
            <button onClick={leaveGame} className="btn-danger rounded">Leave Game</button>
            <div className="d-flex">
                <input type="number" value={number} onChange={({target}) => setNumber(target.value)} className="w-50 form-control" />
                <DropdownButton title={`Deal ${number} cards to...`}>
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
        </div>
    );
}

const styles = {

}

export default GameTools;