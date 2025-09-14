// ChatGPT Conversation Links:
// 1. https://chatgpt.com/share/67ff1f1b-53e4-800b-84f6-829c9dbb54a5
// Add as many links as needed

// PokeAPI - https://pokeapi.co/

const input = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const toggleFavButton = document.getElementById("toggle-favourites");
const loadingIndicator = document.getElementById("loading");
const cardContainer = document.getElementById("pokemon-details");

let data = null;
let types = "";        
let abilities = ""; 

// Modal elements
const modal = document.getElementById("pokemon-modal");
const closeModal = document.getElementById("close-modal");
const modalName = document.getElementById("modal-name");
const modalId = document.getElementById("modal-id");
const modalImg = document.getElementById("modal-img");
const modalTypesContainer = document.querySelector("#modal-types .types-container");
const modalHeightSpan = document.querySelector("#modal-height span");
const modalWeightSpan = document.querySelector("#modal-weight span");
const modalAbilitiesSpan = document.querySelector("#modal-abilities span");
const modalStats = document.getElementById("modal-stats");
const modalStatsContainer = document.querySelector(".modal-stats-container");

searchButton.addEventListener("click", async function () {
    const hero = input.value.trim().toLowerCase();
    if (!hero) return alert("Input cannot be empty.");
  
    try {
      loadingIndicator.classList.remove("hidden");
  
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${hero}`);
      if (!response.ok) throw new Error("Pokémon not found");
  
      data = await response.json();
      cardContainer.innerHTML = "";
  
      const card = document.createElement("div");
      card.classList.add("pokemon-card");
  
      const name = data.name;
      const id = data.id;
      const img = data.sprites.front_default;
      types = data.types.map(t => t.type.name).join(", ");
      abilities = data.abilities.map(a => a.ability.name).join(", ");
  
      card.innerHTML = `
        <img src="${img}" alt="${name}" />
        <h2>${name}</h2>
        <p><strong>ID:</strong> #${id}</p>
        <p><strong>Types:</strong> ${types}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <button id="more-info-btn">More Info</button>
        <button id="add-to-favourites">Add to Favourites</button>
      `;
  
      cardContainer.appendChild(card);
  
      // More Info button behavior
      card.querySelector("#more-info-btn").addEventListener("click", () => {
        modalName.textContent = name;
        modalId.textContent = `#${id}`;
        modalImg.src = img;
        modalTypesContainer.innerHTML = "";
        modalStats.innerHTML = "";
        modalHeightSpan.textContent = `${data.height / 10} m`;
        modalWeightSpan.textContent = `${data.weight / 10} kg`;
        modalAbilitiesSpan.textContent = abilities;
  
        data.types.forEach(t => {
          const span = document.createElement("span");
          modalTypesContainer.appendChild(span);
        });
  
        data.stats.forEach(stat => {
          const statDiv = document.createElement("div");
          statDiv.innerHTML = `
            <span class="stat-name">${stat.stat.name}</span>
            <span class="stat-value">${stat.base_stat}</span>
          `;
          modalStats.appendChild(statDiv);
        });
  
        modal.classList.remove("hidden");
      });
  
      // ✅ Add to Favourites (with fixed 'stats' definition)
      card.querySelector("#add-to-favourites").addEventListener("click", () => {
        const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  
        if (favourites.find(p => p.id === id)) {
          alert(`${name} is already in favourites.`);
          return;
        }
  
        const stats = data.stats.map(stat => ({
          name: stat.stat.name,
          value: stat.base_stat
        }));
  
        favourites.push({ id, name, img, types, abilities, stats });
        localStorage.setItem("favourites", JSON.stringify(favourites));
        alert(`${name} added to favourites!`);
      });
  
    } catch (error) {
      alert("Please enter a correct Pokémon name or ID.");
      console.error(error);
    } finally {
      loadingIndicator.classList.add("hidden");
    }
  });

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

toggleFavButton.addEventListener("click", () => {
    // Toggle search visibility
    document.getElementById("search-button").classList.toggle("hidden");
    document.getElementById("search-input").classList.toggle("hidden");
  
    const isViewingFavourites = toggleFavButton.textContent === "View Favourites";
  
    // Always clear current cards
    cardContainer.innerHTML = "";
  
    // Toggle button text
    toggleFavButton.textContent = isViewingFavourites ? "Back to Search" : "View Favourites";
  
    if (isViewingFavourites) {
      // Show favourites
      const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  
      if (favourites.length === 0) {
        cardContainer.innerHTML = "<p>No favourites yet.</p>";
        return;
      }
  
      favourites.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");
  
        card.innerHTML = `
          <img src="${pokemon.img}" alt="${pokemon.name}" />
          <h2>${pokemon.name}</h2>
          <p><strong>ID:</strong> #${pokemon.id}</p>
          <p><strong>Types:</strong> ${pokemon.types}</p>
          <p><strong>Abilities:</strong> ${pokemon.abilities}</p>
          <button class="more-info-btn">More Info</button>
        `;
  
        card.querySelector(".more-info-btn").addEventListener("click", async () => {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
            if (!response.ok) throw new Error("Failed to fetch Pokémon details");
  
            const fullData = await response.json();
  
            modalName.textContent = pokemon.name;
            modalId.textContent = `#${pokemon.id}`;
            modalImg.src = pokemon.img;
            modalTypesContainer.innerHTML = "";
            modalStats.innerHTML = "";
            modalHeightSpan.textContent = `${fullData.height / 10} m`;
            modalWeightSpan.textContent = `${fullData.weight / 10} kg`;
            modalAbilitiesSpan.textContent = pokemon.abilities;
  
            fullData.stats.forEach(stat => {
              const statDiv = document.createElement("div");
              statDiv.innerHTML = `
                <span class="stat-name">${stat.stat.name}</span>
                <span class="stat-value">${stat.base_stat}</span>
              `;
              modalStats.appendChild(statDiv);
            });
  
            modal.classList.remove("hidden");
          } catch (error) {
            alert("Could not load detailed data.");
            console.error(error);
          }
        });
  
        cardContainer.appendChild(card);
      });
    }
  });
