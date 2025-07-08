const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const secondEl = document.querySelector('.second');
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const theme = document.getElementById('theme');
const digital = document.getElementById('digital');

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

theme.addEventListener('click', (e) => {
    const html = document.querySelector('html');
    if (html.classList.contains('dark')){
        html.classList.remove('dark');
        e.target.innerHTML = 'Modo Oscuro';
    } else {
        html.classList.add('dark');
        e.target.innerHTML = 'Modo Claro';
    }
});

digital.addEventListener('click', (e) => {
    const analogClock= document.querySelector('.analog-clock');
    const digitalClock = document.querySelector('.digital-clock');
    if (digitalClock.classList.contains('none')) {
        digitalClock.classList.remove('none');
        analogClock.classList.add('none');
        e.target.innerHTML = 'Modo Analógico';
    } else {
        analogClock.classList.remove('none');
        digitalClock.classList.add('none');
        e.target.innerHTML = 'Modo Digital';
    }
});

function setTime() {
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hours = time.getHours();
    const hoursForClock = hours % 12 || 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM'

    const secondRotation = seconds * 6 + (minutes * 360) + (hours % 12 * 360 * 60);
    const minuteRotation = minutes * 6 + seconds * 0.1;
    const hourRotation = (hours % 12) * 30 + minutes * 0.5;

    hourEl.style.transform = `translate(-50%, -100%) rotate(${hourRotation}deg)`
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${minuteRotation}deg)`
    secondEl.style.transform = `translate(-50%, -100%) rotate(${secondRotation}deg)`

    timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds} ${ampm}`
    dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`
    
    //console.log("Hora:", hourRotation, "Minutos:", minuteRotation, "Segundos:", secondRotation);
}

setTime();

setInterval(setTime, 1000);