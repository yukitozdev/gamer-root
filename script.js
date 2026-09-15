const API_KEY = "YOUR API KEY HERE";

const container = document.getElementById("games-container");
const searchInput = document.getElementById("search");

let timeout;

async function getGames() {
  container.innerHTML = "<p>Carregando...</p>";

  try {
    const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}`);
    const data = await response.json();

    showGames(data.results);
  } catch (error) {
    container.innerHTML = "<p>Erro ao carregar jogos 😢</p>";
  }
}


async function searchGames(query) {
  container.innerHTML = "<p>Buscando...</p>";

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`
    );

    const data = await response.json();

    showGames(data.results);
  } catch (error) {
    container.innerHTML = "<p>Erro na busca 😢</p>";
  }
}


function showGames(games) {
  container.innerHTML = "";

  games.forEach(game => {
    const div = document.createElement("div");
    div.classList.add("game");

    div.innerHTML = `
      <img src="${game.background_image || 'https://via.placeholder.com/200'}" />
      <div class = "game-content">
        <h3>${game.name}</h3>
        <p>⭐ ${game.rating}</p>
      </div>
    `;

    div.addEventListener("click", () => {
      getGameDetails(game.id);
    });

    container.appendChild(div);
  });
}


async function getGameDetails(id) {
  container.innerHTML = "<p>Carregando detalhes...</p>";

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
    );

    const game = await response.json();

    showGameDetails(game);
  } catch (error) {
    container.innerHTML = "<p>Erro ao carregar detalhes 😢</p>";
  }
}


function showGameDetails(game) {
  container.innerHTML = `
    <button onclick="getGames()">⬅ Voltar</button>

    <h2>${game.name}</h2>

    <img src="${game.background_image}" 
         style="width:300px;border-radius:10px"/>

    <p><strong>⭐ Nota:</strong> ${game.rating}</p>
    <p><strong>📅 Lançamento:</strong> ${game.released}</p>

    <p style="max-width:600px;margin:auto;">
      ${stripHTML(game.description)}
    </p>
  `;
}


function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}


searchInput.addEventListener("input", (event) => {
  clearTimeout(timeout);

  const query = event.target.value;

  timeout = setTimeout(() => {
    if (query.length > 2) {
      searchGames(query);
    } else {
      getGames();
    }
  }, 500);
});


getGames();
