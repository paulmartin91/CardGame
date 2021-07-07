// gameName: {
//  lastid: [int],
//  deck: [obj]
// }
const activeGames = require('./games')

const assignCardId = (gameName) => {
    console.log(activeGames)
    const {deck, lastId} = activeGames[gameName]
    deck.forEach((card, index) => card.id = index + lastId[0])
    lastId[0] = deck.length
}

const deck = [
    {
        "suit": "H",
        "value": 2
    },
    {
        "suit": "H",
        "value": 3
    },
    {
        "suit": "H",
        "value": 4
    },
    {
        "suit": "H",
        "value": 5
    },
    {
        "suit": "H",
        "value": 6
    },
    {
        "suit": "H",
        "value": 7
    },
    {
        "suit": "H",
        "value": 8
    },
    {
        "suit": "H",
        "value": 9
    },
    {
        "suit": "H",
        "value": 10
    },
    {
        "suit": "H",
        "value": 11
    },
    {
        "suit": "H",
        "value": 12
    },
    {
        "suit": "H",
        "value": 13
    },
    {
        "suit": "H",
        "value": 14
    },
    {
        "suit": "D",
        "value": 2
    },
    {
        "suit": "D",
        "value": 3
    },
    {
        "suit": "D",
        "value": 4
    },
    {
        "suit": "D",
        "value": 5
    },
    {
        "suit": "D",
        "value": 6
    },
    {
        "suit": "D",
        "value": 7
    },
    {
        "suit": "D",
        "value": 8
    },
    {
        "suit": "D",
        "value": 9
    },
    {
        "suit": "D",
        "value": 10
    },
    {
        "suit": "D",
        "value": 11
    },
    {
        "suit": "D",
        "value": 12
    },
    {
        "suit": "D",
        "value": 13
    },
    {
        "suit": "D",
        "value": 14
    },
    {
        "suit": "C",
        "value": 2
    },
    {
        "suit": "C",
        "value": 3
    },
    {
        "suit": "C",
        "value": 4
    },
    {
        "suit": "C",
        "value": 5
    },
    {
        "suit": "C",
        "value": 6
    },
    {
        "suit": "C",
        "value": 7
    },
    {
        "suit": "C",
        "value": 8
    },
    {
        "suit": "C",
        "value": 9
    },
    {
        "suit": "C",
        "value": 10
    },
    {
        "suit": "C",
        "value": 11
    },
    {
        "suit": "C",
        "value": 12
    },
    {
        "suit": "C",
        "value": 13
    },
    {
        "suit": "C",
        "value": 14
    },
    {
        "suit": "S",
        "value": 2
    },
    {
        "suit": "S",
        "value": 3
    },
    {
        "suit": "S",
        "value": 4
    },
    {
        "suit": "S",
        "value": 5
    },
    {
        "suit": "S",
        "value": 6
    },
    {
        "suit": "S",
        "value": 7
    },
    {
        "suit": "S",
        "value": 8
    },
    {
        "suit": "S",
        "value": 9
    },
    {
        "suit": "S",
        "value": 10
    },
    {
        "suit": "S",
        "value": 11
    },
    {
        "suit": "S",
        "value": 12
    },
    {
        "suit": "S",
        "value": 13
    },
    {
        "suit": "S",
        "value": 14
    }
]
   
const shuffle = (gameName) => {
    const deck = activeGames[gameName].deck
    var currentIndex = deck.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = deck[currentIndex];
        deck[currentIndex] = deck[randomIndex];
        deck[randomIndex] = temporaryValue;
    }
    console.log(activeGames[gameName].deck[0])
}

const deal = (name, numCards) => {
    let hand = [];
    for (let i = 0; i<numCards; i++){
        hand.push(...activeGames[name].deck.splice(0, 1));
    }
    return hand
}

const returnCards = (name, cards) => {
    activeGames[name].deck.push(...cards)
    console.log(activeGames[name].deck[51])
}

const getRemaining = (name) => activeGames[name].deck.length

module.exports = {
    assignCardId,
    deck,
    deal,
    shuffle,
    returnCards,
    getRemaining
}