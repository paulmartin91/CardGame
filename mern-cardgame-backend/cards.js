module.exports = {

    Deck: class Deck{ 
        deck = [
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
    },
    Shuffle: shuffle = async (oldDeck, newDeck = [], CID = 1) => {
            if (oldDeck.length == 1){
              let card = await oldDeck[0]
              card.CID = await CID
              newDeck.push(card)
              console.log(newDeck)
              return newDeck
              }
            else {
              let randomNumber = Math.floor(Math.random() * Math.floor(oldDeck.length))
              let card = oldDeck[randomNumber]
              card.CID = await CID
              newDeck.push(card)
              oldDeck.splice(randomNumber, 1)
              CID = await CID + 1
              return shuffle(oldDeck, newDeck, CID)
            }
    },

    Deal: function deal(deck, numCards){
        let hand = [];
        for (let i = 0; i<numCards; i++){
            hand.push(...deck.splice(0, 1));
        }
        console.log(deck)
        console.log(numCards)
        return hand
    }
}