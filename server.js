const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./routes");
const connectDB = require("./database/connection");
const socketIo = require('socket.io');
const http = require('http');
const gameService = require('./services/gameService');

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", route);

gameService.startGame();

io.on('connection', (socket) => {
  const player = {
      id: socket.id,
      username: 'Player' + Math.floor(Math.random() * 1000),
      socket: socket
  };

  gameService.addPlayer(player);

  socket.on('disconnect', () => {
      gameService.removePlayer(socket.id);
      console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});