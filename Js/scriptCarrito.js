document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../LoginUsers.html";
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

  BuscarDestinos();
});


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



function VaciarCarrito() {
  localStorage.clear();
  BuscarDestinos();
}

async function BuscarDestinos() {
  let destinos = JSON.parse(localStorage.getItem("carritoViajes")) || [];

  try {
    const destinosContainer = document.getElementById(
      "destinosContainerCarrito"
    );
    destinosContainer.innerHTML = "";

    destinos.forEach((destino, index) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <img src="${destino.Imagen}" alt="${destino.Pais}">
        <h3 Class="Pais" >${destino.Pais}</h3>
        <h4 Class="Ciudad" >${destino.Ciudad}</h4>   
        <br>    
        <h5 Class="SubTitulo" ><b>Precio unitario:</b> ${destino.Precio}</h5> 
        <div class="cantidad-container">
          <button class="btn-restar" data-index="${index}">-</button>
          <span Class="Cantidad">${destino.cantidad || 1}</span>
          <button class="btn-sumar" data-index="${index}">+</button>
        </div>
        <h5 Class="SubTitulo" ><b>Total:</b> ${
          (destino.cantidad || 1) * destino.Precio
        }</h5>
        <button class="btn-eliminar" data-index="${index}">🗑 Eliminar</button>
        <br><br>`;

      destinosContainer.appendChild(div);
    });

    document.querySelectorAll(".btn-sumar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let idx = e.target.getAttribute("data-index");
        destinos[idx].cantidad = (destinos[idx].cantidad || 1) + 1;
        localStorage.setItem("carritoViajes", JSON.stringify(destinos));
        BuscarDestinos();
      });
    });

    document.querySelectorAll(".btn-restar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let idx = e.target.getAttribute("data-index");
        if (destinos[idx].cantidad > 1) {
          destinos[idx].cantidad -= 1;
        }
        localStorage.setItem("carritoViajes", JSON.stringify(destinos));
        BuscarDestinos();
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let idx = e.target.getAttribute("data-index");
        destinos.splice(idx, 1);
        localStorage.setItem("carritoViajes", JSON.stringify(destinos));
        BuscarDestinos();
      });
    });
  } catch (error) {
    console.error("Error al cargar destinos:", error);
  }
}

async function Reservar() {
  let destinos = JSON.parse(localStorage.getItem("carritoViajes")) || [];

  if (destinos.length === 0) {
    alert("El carrito está vacío, no se puede reservar.");
    return;
  }

  try {
    for (let i = 0; i < destinos.length; i++) {
      const destino = destinos[i];
      const cantidad = destino.cantidad || 1;

      const reserva = {
        Pais: destino.Pais,
        Ciudad: destino.Ciudad,
        PrecioUnitario: destino.Precio,
        ImporteTotal: cantidad * destino.Precio,
        CantidadPasajes: cantidad,
        Imagen: destino.Imagen,
        ID_ViajesReserva: destino.ID_Viaje || (i + 1).toString(),
      };

      // Enviar cada reserva individualmente
      const response = await fetch(
        "https://68b60f4be5dc090291b0c8e6.mockapi.io/ViajesReserva",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reserva),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la reserva de " + destino.Pais);
      }

      const data = await response.json();
      console.log("Reserva enviada:", data);
    }

    alert("✅ Todas las reservas se guardaron con éxito.");
    localStorage.removeItem("carritoViajes");
    BuscarDestinos();
  } catch (error) {
    console.error("Error al reservar:", error);
    alert("❌ Ocurrió un error al procesar las reservas.");
  }
}
