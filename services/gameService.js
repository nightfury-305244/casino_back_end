const { Users } = require("../models/user-model");
const { Crash } = require("../models/crash-model");

let isRunning = false;
let multiplier = 1.0;
let gameInterval = null;
let gameStartTime = null;

const startGame = () => {
  isRunning = true;
  multiplier = 1.0;
  gameStartTime = new Date();
  console.log("Game started");

  gameInterval = setInterval(() => {
    multiplier += 0.01;
    console.log(`Current Multiplier: ${multiplier.toFixed(2)}`);

    if (Math.random() < 0.001 * multiplier) {
      endGame();
    }
  }, 100);
};

const endGame = () => {
  clearInterval(gameInterval);
  const gameEndTime = new Date();
  isRunning = false;
  console.log(`Game Crashed at Multiplier: ${multiplier.toFixed(2)}`);

  Users.find({ isActive: true, currentBet: { $gt: 0 } })
    .then((users) => {
      users.forEach((user) => {
        const profit = -user.currentBet;
        const crashRecord = new Crash({
          name: user.name,
          wager: user.currentBet,
          profit: profit,
          result: false,
          Start_Date: gameStartTime,
          End_Date: gameEndTime,
        });
        crashRecord.save();
        console.log(
          `${user.name} lost a bet of ${user.currentBet} due to crash.`
        );
      });

      return Users.updateMany(
        { isActive: true, currentBet: { $gt: 0 } },
        { $set: { currentBet: 0, isActive: false } }
      );
    })
    .then(() => {
      console.log("Waiting...");
    })
    .catch((err) => {
      console.error("Error resetting bets:", err);
    });

  multiplier = 1.0;

  setTimeout(() => {
    startGame();
  }, 5000);
};

const addPlayer = (socket) => {
  Users.findById(socket.userId).then((user) => {
    if (!user) {
      console.log("User not found");
      return;
    }

    console.log(`Player added: ${user.name}`);
    socket.join("activePlayers"); // Using socket.io rooms for active players

    // Update user to active
    Users.findByIdAndUpdate(user._id, { isActive: true }, { new: true }).then(
      (updatedUser) => {
        console.log(`User ${updatedUser.name} is now active.`);
      }
    );
  });
};

const removePlayer = (playerId) => {
  Users.findByIdAndUpdate(playerId, { isActive: false }, { new: true }).then(
    (updatedUser) => {
      console.log(`Player removed: ${updatedUser.name}`);
    }
  );
};

const placeBet = (playerId, betAmount) => {
  Users.findById(playerId).then((user) => {
    if (!user || user.balance < betAmount) {
      console.log("Invalid bet or insufficient balance.");
      return;
    }

    Users.findByIdAndUpdate(
      playerId,
      { $inc: { balance: -betAmount }, currentBet: betAmount },
      { new: true }
    ).then((updatedUser) => {
      // console.log(`${updatedUser.name} placed a bet of ${betAmount}. Remaining balance: ${updatedUser.balance}`);
    });
  });
};

const cashOut = (playerId) => {
  Users.findById(playerId).then((user) => {
    if (!user || !user.isActive || user.currentBet <= 0) {
      console.log("No active bet to cash out.");
      return;
    }

    const payout = user.currentBet * multiplier;
    const profit = payout - user.currentBet;
    Users.findByIdAndUpdate(
      playerId,
      { balance: payout, currentBet: 0, isActive: false },
      { new: true }
    ).then((updatedUser) => {
      // console.log(`${updatedUser.name} cashed out at ${multiplier.toFixed(2)}x, payout: ${payout}, new balance: ${updatedUser.balance}`);

      const crashRecord = new Crash({
        name: user.name,
        wager: user.currentBet,
        profit: profit,
        result: true,
        Start_Date: gameStartTime,
        End_Date: new Date(), // cash out time
      });
      crashRecord.save();
    });
  });
};

module.exports = {
  startGame,
  endGame,
  addPlayer,
  removePlayer,
  placeBet,
  cashOut,
};
