import React from 'react';

import Card from './Card'

function CardsArea({cards, handArea, select, playCard, player}) {
    return (
        <div 
            id={player} 
            onClick={playCard && (event => playCard(event, handArea))} 
            className={
                handArea == "openPlay" ? 
                //"border h-25 w-50 px-3 d-flex justify-content-start align-items-center" 
                "border h-25 w-50 p-1 d-flex position-relative flex-wrap flex-shrink-0" 
                : 
                "w-100 h-50 border d-flex justify-content-start align-items-center p-1 flex-wrap flex-shrink-0"
            }
            style={{overflowY: 'scroll'}}
        >
            {cards.map(props => 
                <Card 
                    key={props.id} 
                    {...props} 
                    select={select && select} 
                    handArea={handArea}
                />
            )}
            {/* <button onClick={() => console.log(cards)}></button> */}
        </div>
    );
}

export default CardsArea;