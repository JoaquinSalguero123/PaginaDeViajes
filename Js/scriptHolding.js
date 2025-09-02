document.addEventListener("DOMContentLoaded", () => {
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
  const url = 'https://68b60f4be5dc090291b0c8e6.mockapi.io/Viajes';

  try {
    const response = await fetch(url);
    const Destinos = await response.json();
    document.getElementById("destinosContainer").innerHTML = "";
    document.getElementById("destino").innerHTML = "";

    Destinos.forEach(destino => {
      const div = document.createElement("div");

      div.classList.add("card");
      div.innerHTML = `
         <img src="${destino.Imagen}" alt="${destino.Pais}">
        <h3>${destino.Pais}</h3>
        <h4>${destino.Ciudad}</h4>
        <h5 > <b>Asientos</b></h5> 
        <h5 id="CantidadAsientos">${destino.Asientos}</h5>    
        <br>    
        <h5><b>Precio</b></h5> 
        <h5 id="PrecioImporte">${destino.Precio}</h5>
        <br>

      `;
      const Option = document.createElement("option");
      Option.value = destino.id;
      Option.textContent = destino.Pais;
      
      document.getElementById("destinosContainer").appendChild(div);
      document.getElementById("destino").appendChild(Option);

    });

  }catch(error){

  }

}

