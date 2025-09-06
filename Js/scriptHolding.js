document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../LoginUsers.html";
    return;
  }

  if (localStorage.getItem("DarckMode") === "true") {
    const body = document.getElementById("BodyPages");
    const button = document.getElementById("ButtonTema");
    const head = document.head;

    // Aplica la clase dark y actualiza el botón
    body.classList.add("bodyDarck");
    button.innerText = "🌙";

    // Evita duplicar el <link> si ya existe
    if (!document.getElementById("darkModeCSS")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../CSS/stylesDarkModePages.css";
      link.id = "darkModeCSS";
      head.appendChild(link);
    }
  }
 

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  SetearBienvenidaUsuario();
  BuscarDestinos();
});

async function BuscarDestinos() {
  const url = "https://68b60f4be5dc090291b0c8e6.mockapi.io/Viajes";

  try {
    const response = await fetch(url);
    const Destinos = await response.json();
    document.getElementById("destinosContainer").innerHTML = "";

    Destinos.forEach((destino) => {
      const div = document.createElement("div");

      div.classList.add("card");
      div.innerHTML = `
    <img src="${destino.Imagen}" alt="${destino.Pais}">
    <h3>${destino.Pais}</h3>
    <h4>${destino.Ciudad}</h4>  
    <h5><b>Precio</b></h5> 
    <h5>${destino.Precio}</h5>
    <br>
    <button class="btn-agregar">Agregar a Carrito</button>
    <br>
    `;

      // botón de carrito
      div.querySelector(".btn-agregar").addEventListener("click", () => {
        agregarAReservas(destino);
      });

      document.getElementById("destinosContainer").appendChild(div);
    });
  } catch (error) {}
}

function SetearBienvenidaUsuario() {
  let NameUser = sessionStorage.getItem("NameUser");
  let TituloBienvenida = document.getElementById("BienvenidaUser");

  console.log(NameUser);

  if (NameUser.trim() !== "") {
    TituloBienvenida.textContent += " " + NameUser;
  }
}

function TemaPagina() {
  const body = document.getElementById("BodyPages");
  const button = document.getElementById("ButtonTema");
  const darkMode = localStorage.getItem("DarckMode");
  const head = document.head;

  const existingLink = document.getElementById("darkModeCSS");
  if (existingLink) {
    existingLink.remove();
  }

  if (darkMode === "true") {
    body.classList.remove("bodyDarck");
    button.innerText = "🔆";
    localStorage.setItem("DarckMode", "false");
  } else {
    body.classList.add("bodyDarck");
    button.innerText = "🌙";
    localStorage.setItem("DarckMode", "true");

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../CSS/stylesDarkModePages.css";
    link.id = "darkModeCSS";
    head.appendChild(link);
  }
}

function agregarAReservas(destino) {
  let carrito = JSON.parse(localStorage.getItem("carritoViajes")) || [];

  // evitar duplicados
  if (!carrito.find((item) => item.ID_Viaje === destino.ID_Viaje)) {
    carrito.push(destino);
    localStorage.setItem("carritoViajes", JSON.stringify(carrito));
    alert(`Se agregó ${destino.Pais} - ${destino.Ciudad} a tus reservas`);
  } else {
    alert("Este destino ya está en tus reservas");
  }
}
