const Card = ({value, suit, id, selected, handArea, select}) => (
        <p 
            key={id}
            className={selected ? 'card bg-secondary h-75' : 'card h-75' }
            style={styles.card}
            onClick={select && (() => select(id, handArea))}
        >
            {value && `${value} of ${suit}`}
            {/* {selected && "selected!"} */}
        </p>
)

const styles = {
    card: {
        width: 60
    }
}

export default Card