const textEl = document.getElementById("text");
const speedEl = document.getElementById("speed");
//const words = "¡Nos encanta programar!";

words = [
    "¡Nos encanta programar!",
    "¡Me encanta programar!",
    "¡Me gusta programar!",
    "¡Programar es interesante!",
    "¡Programar es emocionante!",
    "¡Programar es divertido!",
];

let idx = 1;
let i = Math.floor(Math.random() * words.length);
let speed = 300 / speedEl.value;

writeText();

function writeText() {
    textEl.innerText = words[i].slice(0, idx);
    idx++;
    if (idx > words[i].length) {
        idx = 1;
    }
    setTimeout(writeText, speed);
}

speedEl.addEventListener("input", (e) => {
    speed = 300 / e.target.value;
});
