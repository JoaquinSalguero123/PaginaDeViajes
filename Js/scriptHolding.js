document.addEventListener("DOMContentLoaded", () => {

  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../LoginUsers.html";
  }
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  BuscarDestinos()


});


async function BuscarDestinos(){
  const url = 'https://68b60f4be5dc090291b0c8e6.mockapi.io/Viajes';

  try {
    const response = await fetch(url);
    const Destinos = await response.json();
    document.getElementById("destinosContainer").innerHTML = "";

   Destinos.forEach(destino => {
  const div = document.createElement("div");

  div.classList.add("card");
  div.innerHTML = `
    <img src="${destino.Imagen}" alt="${destino.Pais}">
    <h3>${destino.Pais}</h3>
    <h4>${destino.Ciudad}</h4>  
    <h5><b>Precio</b></h5> 
    <h5>${destino.Precio}</h5>
    <br>
    <button class="btn-agregar">Agregar a reservas</button>
    <br>
  `;

  // botón de carrito
  div.querySelector(".btn-agregar").addEventListener("click", () => {
    agregarAReservas(destino);
  });

  document.getElementById("destinosContainer").appendChild(div);
  });


  }catch(error){

  }

}

function agregarAReservas(destino) {
  let carrito = JSON.parse(localStorage.getItem("carritoViajes")) || [];

  // evitar duplicados
  if (!carrito.find(item => item.ID_Viaje === destino.ID_Viaje)) {
    carrito.push(destino);
    localStorage.setItem("carritoViajes", JSON.stringify(carrito));
    alert(`Se agregó ${destino.Pais} - ${destino.Ciudad} a tus reservas`);
  } else {
    alert("Este destino ya está en tus reservas");
  }
}

