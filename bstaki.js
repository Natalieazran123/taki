let taki = require ('./taki');

module.exports= class Card{  
  constructor(number, color){
    this.number= number;
    this.color = color;
     
  }
    checkcard(playerNumber, playerColor){
      if (playerNumber == this.number || playerColor == this.color){
        return true;
      }else{
        return false;
      }
    }

    updateCard (number,color){
      this.number = number;
      this.color = color;

    }

    checkCard(cardToCheck){
      let lastCardNum = getCardNumber(this.lastCard);
      let lastCardCol = getCardColor(this.lastCard);
      let cardToCheckNum = getCardNumber(cardToCheck);
      let cardToCheckCol = getCardColor(cardToCheck);
      if(lastCardNum != cardToCheckNum || lastCardCol != cardToCheckCol){
        alert ('please change card');
      }else{
        return true;

      }
    }

    getCardNumber(cardNum){
      return cardNum.substring(0,str.indexOf("-"));
    }

    getCardColor(cardColor){
      return cardColor.substring (str.indexOf("-") +1,cardColor.length);

    }
}
    

