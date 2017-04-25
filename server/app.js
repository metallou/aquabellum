"use strict";
let http = require('http');
let fs = require('fs');
let ent = require('ent');

// Chargement du fichier index.html affiché au client
let server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(error, content) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(content);
  });
});

// Chargement de socket.io
let io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
  // Quand un client se connecte, on lui envoie un message
  socket.emit('message', 'Vous êtes bien connecté !');
  // On signale aux autres clients qu'il y a un nouveau venu
  socket.broadcast.emit('message', 'Un autre client vient de se connecter ! ');
  io.sockets.emit('message', "Coucou");

  // Dès qu'on nous donne un pseudo, on le stocke en letiable de session
  socket.on('petit_nouveau', function(pseudo) {
    socket.pseudo = pseudo;
    let message = "Un nouveau participant est arrivé !<br/>Il s'agit de "+pseudo;
    socket.broadcast.emit('nouveau', message);
  });

  /* Dès qu'on reçoit un "message" (clic sur le bouton),
   * on le note dans la console
   */
  socket.on('message', function (message) {
    //On récupère le pseudo de celui qui a cliqué dans les letiables de session
    //console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
    message = ent.encode(message);
    socket.broadcast.emit('newMessage', socket.pseudo+": "+message);
  });
});
  server.listen(8080);
