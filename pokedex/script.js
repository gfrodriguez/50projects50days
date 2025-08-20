const pokeContainer = document.getElementById("poke-container");
const pokeTotal = 1025;
const pokePerPage = 20;
let modal = {};
let btn = {};
let span = {};
let z = 1;
let currentPage = 1;
const colors = {
  Normal: "#A8A878",
  Fuego: "#F08030",
  Agua: "#6890F0",
  Planta: "#78C850",
  Eléctrico: "#F8D030",
  Hielo: "#98D8D8",
  Lucha: "#C03028",
  Veneno: "#A040A0",
  Tierra: "#E0C068",
  Volador: "#A890F0",
  Psíquico: "#F85888",
  Bicho: "#A8B820",
  Roca: "#B8A038",
  Fantasma: "#705898",
  Dragón: "#7038F8",
  Siniestro: "#705848",
  Acero: "#B8B8D0",
  Hada: "#EE99AC",
  Oscuro: "#705848",
  Sombra: "#604E82",
  Cósmico: "#7ECEFD",
  Sonido: "#E8B0F8",
  Cristal: "#58C8E0",
};
const main_types = Object.keys(colors);
const fetchPokemons = async (page = 1) => {
  pokeContainer.innerHTML = ""; // Limpia los Pokémon anteriores
  const start = (page - 1) * pokePerPage + 1;
  const end = Math.min(start + pokePerPage - 1, pokeTotal);
  for (let i = start; i <= end; i++) {
    await callPokeAPI(i);
  }
  renderPagination(page);
};
const callPokeAPI = async (id) => {
  const pokeInfo = {};
  if (!id == "") {
    try {
      const resPoke = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
      const dataPoke = await resPoke.json();
      const resPokeEspecies = await fetch(
        "https://pokeapi.co/api/v2/pokemon-species/" + dataPoke.id
      );
      const dataPokeEspecies = await resPokeEspecies.json();
      pokeInfo.id = dataPoke.id;
      pokeInfo.name = dataPoke.name;
      pokeInfo.image = dataPoke.sprites.other["home"].front_default;
      pokeInfo.height = dataPoke.height / 10;
      pokeInfo.weight = dataPoke.weight / 10;
      for (let i of dataPokeEspecies.flavor_text_entries) {
        if (i.language.name == "es") {
          pokeInfo.description = i.flavor_text.replace(/\n/g, " ");
          break;
        } else {
          pokeInfo.description =
            dataPokeEspecies.flavor_text_entries[0].flavor_text.replace(
              /\n/g,
              " "
            );
        }
      }
      for (let i of dataPokeEspecies.names) {
        if (i.language.name == "es") {
          pokeInfo.name = i.name;
          break;
        } else {
          pokeInfo.name = dataPokeEspecies.name;
        }
      }
      for (let i of dataPokeEspecies.genera) {
        if (i.language.name == "es") {
          pokeInfo.genus = i.genus;
          break;
        }
      }
      pokeInfo.abilities = {};
      let j = 0;
      for (let i of dataPoke.abilities) {
        const resPokeAbilities = await fetch(
          "https://pokeapi.co/api/v2/ability/" + i.ability.name
        );
        const dataPokeAbilities = await resPokeAbilities.json();
        for (let k of dataPokeAbilities.names) {
          if (k.language.name == "es") {
            pokeInfo.abilities[j] = k.name;
            break;
          }
        }
        j++;
      }
      pokeInfo.types = {};
      j = 0;
      for (let i of dataPoke.types) {
        pokeInfo.types[j] = i.type.name;
        j++;
      }
      async function translateTypes(obj) {
        j = 0;
        let types = {};
        for (let i of Object.keys(obj)) {
          const resPokeTypes = await fetch(
            "https://pokeapi.co/api/v2/type/" + obj[i]
          );
          const dataPokeTypes = await resPokeTypes.json();
          for (let k of dataPokeTypes.names) {
            if (k.language.name == "es") {
              types[j] = k.name;
              break;
            }
          }
          j++;
        }
        return types;
      }
      async function removeDuplicates(obj) {
        let unique = {};
        let temp = Object.values(obj);
        return (unique = temp.filter((item, index) => {
          return temp.indexOf(item) === index;
        }));
      }
      pokeInfo.weakness = {};
      j = 0;
      for (let i of dataPoke.types) {
        const resPokeWeakness = await fetch(
          "https://pokeapi.co/api/v2/type/" + i.type.name
        );
        const dataPokeWeakness = await resPokeWeakness.json();
        for (let k of dataPokeWeakness.damage_relations.double_damage_from) {
          pokeInfo.weakness[j] = k.name;
          j++;
        }
      }
      pokeInfo.types = await translateTypes(pokeInfo.types);
      pokeInfo.weakness = await translateTypes(
        await removeDuplicates(pokeInfo.weakness)
      );
      pokeInfo.stats = {};
      for (i of dataPoke.stats) {
        pokeInfo.stats[i.stat.name] = i.base_stat;
      }
      const {hp: Vida,attack: Ataque,defense: Defensa,'special-attack': Ataque_Especial, 'special-defense': Defensa_Especial,speed: Velocidad,...rest} = pokeInfo.stats;
      pokeInfo.stats = { Vida, Ataque, Defensa, Ataque_Especial, Defensa_Especial, Velocidad, ...rest };
    } catch (id) {
      pokeInfo.id = "";
      pokeInfo.name = "";
      pokeInfo.image = "images/nofound.gif";
      pokeInfo.height = "";
      pokeInfo.weight = "";
      pokeInfo.description = "";
      pokeInfo.genus = "";
      pokeInfo.types = "";
      pokeInfo.abilities = {};
      pokeInfo.types = {};
      pokeInfo.weakness = {};
      pokeInfo.stats = {
        hp: 0,
        attack: 0,
        defense: 0,
        "special-attack": 0,
        "special-defense": 0,
        speed: 0,
      };
      console.log(pokeInfo);
    }
  } else {
    pokeInfo.id = "";
    pokeInfo.name = "";
    pokeInfo.image = "images/null.png";
    pokeInfo.height = "";
    pokeInfo.weight = "";
    pokeInfo.description = "";
    pokeInfo.genus = "";
    pokeInfo.types = "";
    pokeInfo.abilities = {};
    pokeInfo.types = {};
    pokeInfo.weakness = {};
    pokeInfo.stats = {
      hp: 0,
      attack: 0,
      defense: 0,
      "special-attack": 0,
      "special-defense": 0,
      speed: 0,
    };
  }
  createPokemonCard(pokeInfo);
};
const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");
  pokemonEl.id = pokemon.name;
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, "0");
  const color = colors[pokemon.types[0]];
  pokemonEl.style.backgroundColor = color;
  const pokemonInnerHTML =
    `
    <div class="img-container">
        <img loading="lazy" src="${pokemon.image}" alt="${pokemon.name}"/>
    </div>
    <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name">${pokemon.name}</h3>
        <small class="type">Tipo: <span>` +
    Object.values(pokemon.types).join(", ") +
    `</span> </small>
    </div>
    
    `;
  pokemonEl.innerHTML = pokemonInnerHTML;
  pokeContainer.appendChild(pokemonEl);
  const modalEl = document.createElement("div");
  modalEl.id = `modal${pokemon.name}`;
  modalEl.classList.add("modal");
  modalEl.style.backgroundColor = color;
  modalEl.innerHTML = `
  <div class="modal-content">
  <div class="modal-header" style="background-color: ${color};">
    <span class="close">&times;</span>
    <h2>${pokemon.name}</h2>
    <small>${pokemon.genus}</small>
  </div>
  <div class="modal-body">
    <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy">
    <p>${pokemon.description}</p>
    
    <p><strong>Altura:</strong> ${pokemon.height} m</p>
    <p><strong>Peso:</strong> ${pokemon.weight} kg</p>
    
    <p><strong>Tipo:</strong> ${Object.values(pokemon.types).join(", ")}</p>
    <p><strong>Debilidades:</strong> ${Object.values(pokemon.weakness).join(
    ", "
  )}</p>
    
    <p><strong>Habilidades:</strong> ${Object.values(pokemon.abilities).join(
    ", "
  )}</p>

    <div class="stats">
      ${Object.entries(pokemon.stats)
      .map(([stat, value]) => {
        return `<div class="stat"><span>${stat}:</span><div class="stat-bar" style="width:${value / 2
          }%">${value}</div></div>`;
      })
      .join("")}
    </div>
  </div>
</div>
</div>

`;
  pokeContainer.appendChild(modalEl);
  modal[pokemon.id - 1] = modalEl;
  btn[pokemon.id - 1] = pokemonEl;
  span[pokemon.id - 1] = modalEl.querySelector(".close");
  btn[pokemon.id - 1].onclick = () => {
    modal[pokemon.id - 1].style.display = "block";
  };
  span[pokemon.id - 1].onclick = () => {
    modal[pokemon.id - 1].style.display = "none";
  };
  window.addEventListener("click", (event) => {
    if (event.target === modal[pokemon.id - 1]) {
      modal[pokemon.id - 1].style.display = "none";
    }
  });
};

function renderPagination(currentPage) {
  const totalPages = Math.ceil(pokeTotal / pokePerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Anterior";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => fetchPokemons(currentPage - 1);
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.onclick = () => fetchPokemons(i);
      pagination.appendChild(btn);
    } else if (
      i === currentPage - 3 ||
      i === currentPage + 3
    ) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Siguiente";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => fetchPokemons(currentPage + 1);
  pagination.appendChild(nextBtn);
}

window.addEventListener("load", () => fetchPokemons(1));