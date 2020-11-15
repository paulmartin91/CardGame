cardLinks = {
    C: [
        'CardPics/2C.png',
        'CardPics/3C.png',
        'CardPics/4C.png',
        'CardPics/5C.png',
        'CardPics/6C.png',
        'CardPics/7C.png',
        'CardPics/8C.png',
        'CardPics/9C.png',
        'CardPics/10C.png',
        'CardPics/JC.png',
        'CardPics/QC.png',
        'CardPics/KC.png',
        'CardPics/AC.png',
    ],
    S: [
        'CardPics/2S.png',
        'CardPics/3S.png',
        'CardPics/4S.png',
        'CardPics/5S.png',
        'CardPics/6S.png',
        'CardPics/7S.png',
        'CardPics/8S.png',
        'CardPics/9S.png',
        'CardPics/10S.png',
        'CardPics/JS.png',
        'CardPics/QS.png',
        'CardPics/KS.png',
        'CardPics/AS.png',
    ],
    D: [
        'CardPics/2D.png',
        'CardPics/3D.png',
        'CardPics/4D.png',
        'CardPics/5D.png',
        'CardPics/6D.png',
        'CardPics/7D.png',
        'CardPics/8D.png',
        'CardPics/9D.png',
        'CardPics/10D.png',
        'CardPics/JD.png',
        'CardPics/QD.png',
        'CardPics/KD.png',
        'CardPics/AD.png',
    ],
    H: [
        'CardPics/2H.png',
        'CardPics/3H.png',
        'CardPics/4H.png',
        'CardPics/5H.png',
        'CardPics/6H.png',
        'CardPics/7H.png',
        'CardPics/8H.png',
        'CardPics/9H.png',
        'CardPics/10H.png',
        'CardPics/JH.png',
        'CardPics/QH.png',
        'CardPics/KH.png',
        'CardPics/AH.png',
    ]
}

const getCard = (suit, number) => {
    console.log(suit)
    //console.log(cardLinks[suit][number-2])
    return cardLinks[suit][number-2]
}