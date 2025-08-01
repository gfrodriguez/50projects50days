const poke_container = document.getElementById("poke-container");
const pokemon_count = 150;
const colors = {
    // Tipos básicos
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
    Oscuro: "#705848",  // Siniestro (alternativo)
    Sombra: "#604E82",  // Para juegos como Pokémon GO
    Cósmico: "#7ECEFD", // Tipo personalizado
    Sonido: "#E8B0F8",  // Para movimientos de sonido
    Cristal: "#58C8E0", // Referencia a Pokémon Cristal
};

const main_types = Object.keys(colors);

const fetchPokemons = async () => {
    for (let i = 1; i <= pokemon_count; i++) {
        await callPokeAPI(i);
    }
};

const callPokeAPI = async (id) => {
    const pokeInfo = {};
    if (!id == "") {
        /* Convirtiendo la entrada a minúsculas. */
        /* Obtener datos de una API y almacenarlos en un objeto. */
        try {
            const resPoke = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
            const dataPoke = await resPoke.json();
            const resPokeEspecies = await fetch(
                "https://pokeapi.co/api/v2/pokemon-species/" + dataPoke.id
            );
            const dataPokeEspecies = await resPokeEspecies.json();
            pokeInfo.id = dataPoke.id;
            pokeInfo.name = dataPoke.name;
            pokeInfo.image = dataPoke.sprites.other["official-artwork"].front_default;
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
            /* Obtener las habilidades de los pokemon y traducirlas al español. */
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

            /**
             * Toma un objeto con los id de tipo como claves y los nombres de tipo como valores, y
             * devuelve un objeto con los id de tipo como claves y los nombres de tipo en español como
             * valores.
             * </código>
             * @param obj - el objeto que contiene los tipos de pokemon
             * @returns Una matriz de objetos.
             */
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

            j = 0;
            for (i of dataPoke.stats) {
                pokeInfo.stats[i.stat.name] = i.base_stat;
                j++;
            }

            /*for (let i of progressBar) {
                      i.classList.add('progress-bar-striped', 'progress-bar-animated');
                  }*/
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

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, "0");
    const color = colors[pokemon.types[0]];
    pokemonEl.style.backgroundColor = color

    const pokemonInnerHTML = `
    <div class="img-container">
        <img src="${pokemon.image}" alt="" loading="lazy">
    </div>
    <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Tipo: <span>`+ Object.values(pokemon.types).join(', ') + `</span> </small>
    </div>
    `;

    pokemonEl.innerHTML = pokemonInnerHTML;

    poke_container.appendChild(pokemonEl);
};

addEventListener("load", fetchPokemons());
