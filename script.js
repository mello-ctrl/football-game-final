let score = 0;
let shotsLeft = 5;
let currentPlayer = "";

// Load leaderboard from localStorage (or empty if none yet)
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// 🎵 Load sound effects
const goalSound = new Audio("sounds/goal.mp3");
const saveSound = new Audio("sounds/save.mp3");

// Start game after entering player name
function startGame() {
  let nameInput = document.getElementById("playerName").value.trim();
  if (nameInput === "") {
    alert("Please enter your name to play!");
    return;
  }

  currentPlayer = nameInput;
  score = 0;
  shotsLeft = 5;

  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("shots").innerText = "Shots left: 5";
  document.getElementById("message").innerText = "";
  document.getElementById("ball").style.bottom = "20px";
  document.getElementById("ball").style.left = "160px";
  document.getElementById("goalkeeper").style.left = "130px";

  document.getElementById("shootBtn").disabled = false;
}

// Shoot function with ball kick & goalkeeper dive
function shoot() {
  if (shotsLeft <= 0) {
    document.getElementById("message").innerText = "No shots left! Restart the game.";
    return;
  }

  let goalkeeper = document.getElementById("goalkeeper");
  let ball = document.getElementById("ball");

  // Random player shot
  let playerShot = Math.floor(Math.random() * 3);
  let targetLeft = playerShot === 0 ? 60 : playerShot === 1 ? 160 : 260;

  // Random goalkeeper dive
  let goalkeeperPosition = Math.floor(Math.random() * 3);
  let goalkeeperTarget = goalkeeperPosition === 0 ? 50 : goalkeeperPosition === 1 ? 130 : 220;

  // Animate ball and goalkeeper
  ball.style.left = targetLeft + "px";
  ball.style.bottom = "120px";
  goalkeeper.style.left = goalkeeperTarget + "px";

  // Delay to allow animation, then decide goal/save
  setTimeout(() => {
    if (goalkeeperPosition === playerShot) {
      document.getElementById("message").innerText = "😢 Saved by the goalkeeper!";
      saveSound.play();
    } else {
      document.getElementById("message").innerText = "🎉 Goal!!!";
      goalSound.play();
      score++;
    }

    shotsLeft--;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("shots").innerText = "Shots left: " + shotsLeft;

    // Update leaderboard if game ends
    if (shotsLeft === 0) {
      leaderboard.push({ name: currentPlayer, score: score });
      saveLeaderboard();
      updateLeaderboard();
      announceWinner();
    }
  }, 600);
}

// Restart game
function restart() {
  score = 0;
  shotsLeft = 5;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("shots").innerText = "Shots left: 5";
  document.getElementById("message").innerText = "";
  document.getElementById("ball").style.bottom = "20px";
  document.getElementById("ball").style.left = "160px";
  document.getElementById("goalkeeper").style.left = "130px";
}

// Update leaderboard (top 5 players)
function updateLeaderboard() {
  let leaderboardEL = document.getElementById("leaderboard");
  leaderboardEL.innerHTML = "";

  leaderboard.sort((a, b) => b.score - a.score);

  leaderboard.slice(0, 5).forEach((entry, index) => {
    let li = document.createElement("li");
    if (index === 0) {
      li.textContent = "👑 " + entry.name + ": " + entry.score;
      li.style.fontWeight = "bold";
      li.style.color = "gold";
    } else {
      li.textContent = entry.name + ": " + entry.score;
    }
    leaderboardEL.appendChild(li);
  });
}


// Save leaderboard in localStorage
function saveLeaderboard() {
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Clear leaderboard
function clearLeaderboard() {
  leaderboard = [];
  saveLeaderboard();
  updateLeaderboard();
}

// Announce winner at end of game
function announceWinner() {
  if (leaderboard.length === 0) return;
  leaderboard.sort((a, b) => b.score - a.score);
  let topPlayer = leaderboard[0];
  document.getElementById("message").innerText += ` 👑 Top Player: ${topPlayer.name} with ${topPlayer.score} goals!`;
}

// Show leaderboard on page load
updateLeaderboard();