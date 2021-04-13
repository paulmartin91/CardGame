import React from 'react';

import Card from './Card'

function CardsArea({cards, handArea, select, playCard}) {
    return (
        <div onClick={playCard && (event => playCard(event, handArea))} className={handArea == "openPlay" ? "border h-25 w-50 px-3 bg-light d-flex justify-content-start align-items-center" : "w-100 h-50 border d-flex justify-content-start align-items-center px-3"}>
            { cards.map(props => <Card key={props.id} {...props} select={select && select} handArea={handArea}/>) }
            {/* <button onClick={() => console.log(cards)}></button> */}
        </div>
    );
}

export default CardsArea;