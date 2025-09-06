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
  // Toggle menú
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  menuToggle?.addEventListener("click", () => nav.classList.toggle("active"));

  // Cargar reservas desde la API
  cargarReservas();
});

async function cargarReservas() {
  const contenedor = document.getElementById("contenedorReservas");
  contenedor.innerHTML = "";

  try {
    const response = await fetch("https://68b60f4be5dc090291b0c8e6.mockapi.io/ViajesReserva");
    const reservas = await response.json();

    reservas.forEach(reserva => {
      const card = document.createElement("div");
      card.classList.add("reserva-card");

      card.innerHTML = `
        <img src="${reserva.Imagen}" alt="${reserva.Pais}">
        <h3>${reserva.Pais} - ${reserva.Ciudad}</h3>
        <p><strong>Precio Por Asiento:</strong> $${reserva.PrecioUnitario}</p>
        <p><strong>Asientos :</strong> ${reserva.CantidadPasajes}</p>
        <p><strong>Importe Total :</strong> ${reserva.ImporteTotal}</p>
        <form class="form-reserva">
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre-${reserva.id}">Nombre completo</label>
              <input type="text" id="nombre-${reserva.id}" required>
              <small class="error">Campo requerido</small>
            </div>

            <div class="form-group">
              <label for="email-${reserva.id}">Correo electrónico</label>
              <input type="email" id="email-${reserva.id}" required>
              <small class="error">Campo requerido</small>
            </div>

            <div class="form-group">
              <label for="telefono-${reserva.id}">Teléfono</label>
              <input type="tel" id="telefono-${reserva.id}" pattern="\\d{10}" required>
              <small class="error">Campo requerido</small>
            </div>

            <div class="form-group">
              <label for="marca-${reserva.id}">Marca del Aerolínea</label>
              <select id="marca-${reserva.id}" required>
                <option value="">Selecciona una marca</option>
                <option>Viajes Express</option>
                <option>Luxury Tours</option>
                <option>EcoTravel</option>
              </select>
              <small class="error">Campo requerido</small>
            </div>

            <div class="form-group">
              <label for="pago-${reserva.id}">Medio de pago</label>
              <select id="pago-${reserva.id}" required>
                <option value="">Selecciona un medio</option>
                <option>Tarjeta de crédito</option>
                <option>Tarjeta de débito</option>
                <option>Transferencia</option>
              </select>
              <small class="error">Campo requerido</small>
            </div>
          </div>

          <button type="submit">Reservar ahora</button>
          <button type="button" class="cancelar">Cancelar</button>
        </form>
      `;

      // Función para eliminar de la API y del DOM
      const eliminarReserva = async () => {
        try {
          await fetch(`https://68b60f4be5dc090291b0c8e6.mockapi.io/ViajesReserva/${reserva.id}`, {
            method: "DELETE"
          });
        } catch (error) {
          console.error("Error eliminando la reserva de la API:", error);
        }

        // Eliminar del DOM
        card.remove();

        // Eliminar del carrito localStorage si existe
        let carrito = JSON.parse(localStorage.getItem("carritoViajes")) || [];
        carrito = carrito.filter(v => v.id != reserva.id);
        localStorage.setItem("carritoViajes", JSON.stringify(carrito));
      };

      // Manejo de Reservar
      const form = card.querySelector(".form-reserva");
      form.addEventListener("submit", e => {
        e.preventDefault();

        const nombre = form.querySelector(`#nombre-${reserva.id}`).value.trim();
        const email = form.querySelector(`#email-${reserva.id}`).value.trim();
        

        if (!nombre || !email) {
          alert("Por favor completa todos los campos requeridos.");
          return;
        }

        alert(`✅ Reserva confirmada para ${reserva.Ciudad}`);
        eliminarReserva();
      });

      // Manejo de Cancelar
      const btnCancelar = card.querySelector(".cancelar");
      btnCancelar.addEventListener("click", () => {
        alert(`❌ Reserva cancelada para ${reserva.Ciudad}`);
        eliminarReserva();
      });

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando reservas:", error);
    contenedor.innerHTML = "<p>No se pudieron cargar las reservas.</p>";
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