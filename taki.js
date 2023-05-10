let bstaki= require ('./bstaki');

module.exports= class taki{

    constructor(numberOfPlayers){
        if(numberOfPlayers < 2 || numberOfPlayers > 4)
        throw new Error ("number of players not ok");
        this.players= []; 
        this.deck=[];
        this.lastCard;
        for (let i=0;i<numberOfPlayers;i++){
            this.players.push([]);

        }

        let colors =  ['red', 'blue', 'green', 'yellow'];
        let specialCards = ['stop','plus2', 'plus', 'changedirection'];

        for(let i=0; i<colors.length; i++){
            for(let j=1; j<10; j++){
                if(i == j) continue;
                this.deck.push(j + '-' + colors[i]);
            }
        }

        for(let i=0; i<specialCards.length; i++){
            for(let j=0; j<4; j++){
                if(i == 2) continue;
                this.deck.push(specialCards[i]+ '-' +colors[i]);
            }
        }
        
        for (let i =  this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp =  this.deck[i];
            this.deck[i] =  this.deck[j];
            this.deck[j] = temp;
        
        }

            

            //לולאת חלוקה לכל שחקן-8 קלפים והוצאה מהקופה
        for(let player=0;player < numberOfPlayers;player++){
            for(let i=0;i<8;i++){
                this.players.push(this.deck.pop());
            }
        }
            
        this.lastCard = this.deck.pop();
    }

    getDeck(){
        return this.deck;
    }

    getPlayers(){
        return this.players;
    }

    updateLastCard(card2){
    this.lastCard = card2;
    }

    getLastCard(){
        return this.lastCard;
    }

    updateCard (number,color){
        this.number = number;
        this.color = color;
    }
  
    checkCard(cardToCheck){
        let Last = this.lastCard + "";
        let lastCardNum = this.lastCard.substring(0,this.lastCard.indexOf("-"));
        let lastCardCol = this.lastCard.substring(this.lastCard.indexOf("-") +1,this.lastCard.length);
        let cardToCheckNum = cardToCheck.substring(0,cardToCheck.indexOf("-"));
        let cardToCheckCol = cardToCheck.substring(cardToCheck.indexOf("-") +1,cardToCheck.length);
        if(lastCardNum != cardToCheckNum || lastCardCol != cardToCheckCol){
            return false;
        }else{
            return true;
        }
    }
  

}

