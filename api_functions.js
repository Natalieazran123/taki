let st = require("./server_tools");
let taki = require("./taki");

let deck = new taki(2);


exports.login = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  validateUser(username, password, (isValid) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(isValid ? "ok" : "invalid");
  });
};

exports.signup = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("Username and password are required");
    return;
  }

  st.query("INSERT INTO users(username,password) VALUES (?,?)",[username, password],(result, err) => {
      if (err) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("taken");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
    }
  );
};

exports.getLobby = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("Username and password are required");
    return;
  }

  st.query("UPDATE users SET lobby=? WHERE username = ? AND NOT lobby = -1",[Date.now(), username],(result, err) => {
    if (err) {
      res.writeHead(500, { "Content-type": "text/plain" });
      res.end("Error executing");
      return;
    }
  st.query("SELECT username FROM users WHERE ? - lobby < 2000",[Date.now()],(result, err) => {
    if (err) {
      res.writeHead(500, { "Content-type": "text/plain" });
      res.end("Error executing sql query");
      return;
    }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
        }
      );
    }
  );
};

exports.startgame = (req, res, q) => {
  let username = q.query.username;
  let partner = q.query.partner;
  if (!partner) return;
  st.query("UPDATE users SET lobby = -1 WHERE username IN (?,?) AND ?-lobby < 2000",[username, partner, Date.now()],(result, err) =>{
    if (err) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("error")
      return;
    }
    if (result.affectedRows == 2) {
  st.query("INSERT INTO games(player1, player2) VALUES (?,?)",[username, partner],(result, err) => {
    if (err) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("error")
      return;
    }
     res.writeHead(200, { "Content-Type": "text/plain" });
     res.end("ok");
     return;
     }
  );
     }    
     }
  );
};

exports.getCards = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("error,try again");
    return;
  }

  let deck2 = deck.getDeck();
  deck2 = JSON.stringify(deck2);

  res.writeHead(200, { "Content-type": "application/json" });
  res.end(deck2);
};

exports.getLastcard = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("error,try again");
    return;
  }

  let cardLast = deck.getLastCard();
  cardLast = JSON.stringify(cardLast);

  res.writeHead(200, { "Content-type": "application/json" });
  res.end(cardLast);
};

exports.getHand = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("error,try again");
    return;
  }

  let hand = deck.getPlayers();
  let handArr = [];
  for (let i = 0; i < 8; i++) {
    handArr.push(hand[i]);
  }

  let hand2 = JSON.stringify(handArr);
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(hand2);
};

exports.updateLastCard = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  let cardNumber = q.query.cardnumber;
  let cardColor = q.query.cardcolor;
  let card = q.query.card;
  if (!username || !password) {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("error,try again");
    return;
  }

  deck.updateLastCard(card);
  res.writeHead(200, { "Content-type": "application/json" });
  res.end("ok");
};

function validateUser(username, password, callback) {
  st.query("SELECT COUNT(*) AS count FROM users WHERE username=? AND BINARY password=?",[username, password],(result, err) => {
    if (err) {
        callback(false);
        return;
      }
      callback(result[0].count == 1);
    }
  );
}

exports.getGameStatus = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  if (!username || !password) return;
  st.query("SELECT id FROM games WHERE (player1=? OR player2=?) AND active=1",[username, username],(result, err) => {
    if (err) {
        res.writeHead(400,{"Content-Type": "text/plain"});
        res.end ("error,try again");
      }
      if (result.length >= 1) {
        let gameId = result[0].id;
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(gameId + "");
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("-1");
      }
    }
  );
};


  

exports.checkmove = (req, res, q) => {
  let username = q.query.username;
  let password = q.query.password;
  let cardNumber = q.query.cardnumber;
  let cardColor = q.query.cardcolor;

  let card = cardNumber + "-" + cardColor;
  if (!username || !password) {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("error,try again");
    return;
  }
  deck.checkCard(card);
  res.writeHead(200, { "Content-type": "application/json" });
  res.end("ok");
};

exports.checkLastCard=(req, res,q)=>{
  let username = q.query.username;
  let password = q.query.password;
  cardLast = deck.getLastCard();
  if(userCard.childElementCount == 1){
    alert ('The second player has one last card!');
    res.writeHead(200, { "Content-type": "application/json" });
     res.end("ok");

  }else{
    res.writeHead(400, { "Content-type": "text/plain" });
    res.end("error,try again");
    return;
  }
   

}