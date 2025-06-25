const jokeEl = document.getElementById('joke');
const jokeBtn = document.getElementById('jokeBtn');

jokeBtn.addEventListener('click', generateJoke);

generateJoke();

async function generateJoke() {
    const config = {
        headers: {
            Accept: 'application/json'
        }
    }

    const res = await fetch('https://v2.jokeapi.dev/joke/Any?lang=es', config);

    const data = await res.json();

    jokeEl.innerHTML = data.setup ? `${data.setup} <br> ${data.delivery}` : data.joke;
}