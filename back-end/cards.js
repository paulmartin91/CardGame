module.exports = {

    Deck: [
    {
        "suit": "hearts",
        "value": 2
    },
    {
        "suit": "hearts",
        "value": 3
    },
    {
        "suit": "hearts",
        "value": 4
    },
    {
        "suit": "hearts",
        "value": 5
    },
    {
        "suit": "hearts",
        "value": 6
    },
    {
        "suit": "hearts",
        "value": 7
    },
    {
        "suit": "hearts",
        "value": 8
    },
    {
        "suit": "hearts",
        "value": 9
    },
    {
        "suit": "hearts",
        "value": 10
    },
    {
        "suit": "hearts",
        "value": 11
    },
    {
        "suit": "hearts",
        "value": 12
    },
    {
        "suit": "hearts",
        "value": 13
    },
    {
        "suit": "hearts",
        "value": 14
    },
    {
        "suit": "diamonds",
        "value": 2
    },
    {
        "suit": "diamonds",
        "value": 3
    },
    {
        "suit": "diamonds",
        "value": 4
    },
    {
        "suit": "diamonds",
        "value": 5
    },
    {
        "suit": "diamonds",
        "value": 6
    },
    {
        "suit": "diamonds",
        "value": 7
    },
    {
        "suit": "diamonds",
        "value": 8
    },
    {
        "suit": "diamonds",
        "value": 9
    },
    {
        "suit": "diamonds",
        "value": 10
    },
    {
        "suit": "diamonds",
        "value": 11
    },
    {
        "suit": "diamonds",
        "value": 12
    },
    {
        "suit": "diamonds",
        "value": 13
    },
    {
        "suit": "diamonds",
        "value": 14
    },
    {
        "suit": "clubs",
        "value": 2
    },
    {
        "suit": "clubs",
        "value": 3
    },
    {
        "suit": "clubs",
        "value": 4
    },
    {
        "suit": "clubs",
        "value": 5
    },
    {
        "suit": "clubs",
        "value": 6
    },
    {
        "suit": "clubs",
        "value": 7
    },
    {
        "suit": "clubs",
        "value": 8
    },
    {
        "suit": "clubs",
        "value": 9
    },
    {
        "suit": "clubs",
        "value": 10
    },
    {
        "suit": "clubs",
        "value": 11
    },
    {
        "suit": "clubs",
        "value": 12
    },
    {
        "suit": "clubs",
        "value": 13
    },
    {
        "suit": "clubs",
        "value": 14
    },
    {
        "suit": "spades",
        "value": 2
    },
    {
        "suit": "spades",
        "value": 3
    },
    {
        "suit": "spades",
        "value": 4
    },
    {
        "suit": "spades",
        "value": 5
    },
    {
        "suit": "spades",
        "value": 6
    },
    {
        "suit": "spades",
        "value": 7
    },
    {
        "suit": "spades",
        "value": 8
    },
    {
        "suit": "spades",
        "value": 9
    },
    {
        "suit": "spades",
        "value": 10
    },
    {
        "suit": "spades",
        "value": 11
    },
    {
        "suit": "spades",
        "value": 12
    },
    {
        "suit": "spades",
        "value": 13
    },
    {
        "suit": "spades",
        "value": 14
    }
    ],
    Shuffle: function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      },
    Deal: function deal(deck, numCards){
        let hand = [];
        for (let i = 0; i<numCards; i++){
            hand.push(...deck.splice(0, 1));
        }
        return hand
    }
}