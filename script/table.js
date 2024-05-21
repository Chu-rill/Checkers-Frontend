document.addEventListener("DOMContentLoaded", () => {
  fetch("/leaderboard")
    .then((response) => response.json())
    .then((data) => {
      const leaderboardContainer = document.getElementById("leaderboard");
      data.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "leaderboard-item";
        playerDiv.innerHTML = `
            <div>${index + 1}</div>
            <div>${player.name}</div>
            <div>${player.wins}</div>
            <div>${player.losses}</div>
          `;
        leaderboardContainer.appendChild(playerDiv);
      });
    });
});
