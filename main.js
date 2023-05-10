let Taki = require("./taki");
let http = require("http");
let url = require("url");
let st = require("./server_tools");
let api = require("./api_functions");
let fs = require("fs");
let bs = require("./bstaki");

let apiFunctions = {
  "/login": api.login,
  "/sign_up": api.signup,
  "/get_lobby": api.getLobby,
  "/start_game": api.startgame,
  "/leave_game": api.leavegame,
  "/get_last_card": api.getLastcard,
  "check_last_card": api.checkLastCard,
  "/get_cards": api.getCards,
  "/get_hand": api.getHand,
  "/get_game_status": api.getGameStatus,
  "/update_last_card": api.updateLastCard,
  "/check_move": api.checkmove,

};

let taki = new Taki(2);

http
  .createServer((req, res) => {
    let q = url.parse(req.url, true);
    let path = q.pathname;
    if (path.startsWith("/api")) {
      path = path.substring(4);
      if (!apiFunctions[path]) {
        res.writeHead(400, { "content-type": "text-plain" });
        res.end("no such action");
        return;
      }

      apiFunctions[path](req, res, q);
    } else {
      st.serveStaticFile(path, res);
    }
  })
  .listen(8080);
