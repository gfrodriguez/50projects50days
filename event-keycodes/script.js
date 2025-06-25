const insert = document.getElementById("insert");

window.addEventListener ("keydown", (event) => {
    insert.innerHTML = `
    <div class="key">
    ${event.key === " " ? "Space" : event.key}
    <small>event.key</small>
    </div>

    <div class="key">
    ${event.keyCode}
    <small>event.keyCode</small>
    </div>

    <div class="key">
    ${event.code}
    <small>event.code</small>
    </div>

    <div class="key">
    ${event.location === 0 ? "General" : event.location === 1 ? "Izquierda" : "Derecha"}
    <small>event.location</small>
    </div>
    `;
});