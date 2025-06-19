const boxes = document.querySelectorAll('.box');

window.addEventListener('scroll', checkBoxes);

// checkboxes se ejecuta al hacer scroll al cargar la página, es la primera ejecución
checkBoxes()

// Función que comprueba si las cajas deben mostrarse o no
function checkBoxes() {
    const triggerBottom = window.innerHeight / 5 * 4;

    boxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;

        if (boxTop < triggerBottom) {
            box.classList.add('show');
        } else {
            box.classList.remove('show');
        }
    });
}