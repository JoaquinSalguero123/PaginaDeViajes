document.addEventListener("DOMContentLoaded", () => {

  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../LoginUsers.html";
  }

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  const form = document.getElementById("viajeForm");
  const inputs = form.querySelectorAll("input, select");
  const submitBtn = document.getElementById("submitBtn");

  function validateField(field) {
    const errorMsg = field.parentElement.querySelector(".error");
    let valid = true;

    if (!field.value.trim()) {
      errorMsg.textContent = "Este campo es obligatorio";
      errorMsg.style.display = "block";
      valid = false;
    } else if (field.id === "telefono" && !/^\d{10}$/.test(field.value)) {
      errorMsg.textContent = "Ingrese un teléfono válido (10 dígitos)";
      errorMsg.style.display = "block";
      valid = false;
    } else {
      errorMsg.textContent = "";
      errorMsg.style.display = "none";
    }

    return valid;
  }

  function checkForm() {
    let allValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) allValid = false;
    });
    submitBtn.disabled = !allValid;
  }

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      validateField(input);
      checkForm();
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("¡Reserva realizada con éxito!");
    form.reset();
    submitBtn.disabled = true;
  });


  BuscarDestinos()


});


async function BuscarDestinos(){
  // leer del carrito
  let carrito = JSON.parse(localStorage.getItem("carritoViajes")) || [];

  const selectDestino = document.getElementById("destino");
  selectDestino.innerHTML = "";

  if (carrito.length > 0) {
    carrito.forEach(destino => {
      const option = document.createElement("option");
      option.value = destino.id;
      option.textContent = `${destino.Pais} - ${destino.Ciudad} ($${destino.Precio})`;
      selectDestino.appendChild(option);
    });
  } else {
    // fallback: traer de la API si no hay nada en carrito
    const url = 'https://68b60f4be5dc090291b0c8e6.mockapi.io/Viajes';
    try {
      const response = await fetch(url);
      const Destinos = await response.json();
      Destinos.forEach(destino => {
        const option = document.createElement("option");
        option.value = destino.id;
        option.textContent = destino.Pais;
        selectDestino.appendChild(option);
      });
    } catch (error) {
      console.log("Error cargando destinos", error);
    }
  }
}


function EliminiarLS(){
  localStorage.clear()
}

