const Card = ({value, suit, id, selected, handArea, select}) => (
        <div 
            key={id}
            ///className={selected && selected : 'card' }
            onClick={select && (() => select(id, handArea))}
            className={!selected && "pb-2"}
        >  
        <img
            style={{width: 50}} 
            src={ value ? `CardImages/${value + suit}.png` : `CardImages/blue_back.png`}
        />   
        {selected && <div style={{width: "98%", height: 10, backgroundColor: "green", borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginTop: -5}}/>}
            
        </div>
)

export default Card