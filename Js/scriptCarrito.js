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

function VaciarCarrito(){
  localStorage.clear()
  BuscarDestinos()
}

async function BuscarDestinos() {
  let destinos = JSON.parse(localStorage.getItem("carritoViajes")) || [];

  try {
    const destinosContainer = document.getElementById("destinosContainerCarrito");
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
        <h5 Class="SubTitulo" ><b>Total:</b> ${(destino.cantidad || 1) * destino.Precio}</h5>
        <button class="btn-eliminar" data-index="${index}">🗑 Eliminar</button>
        <br><br>`;
      
      destinosContainer.appendChild(div);
    });


    document.querySelectorAll(".btn-sumar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        let idx = e.target.getAttribute("data-index");
        destinos[idx].cantidad = (destinos[idx].cantidad || 1) + 1;
        localStorage.setItem("carritoViajes", JSON.stringify(destinos));
        BuscarDestinos();
      });
    });

    document.querySelectorAll(".btn-restar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        let idx = e.target.getAttribute("data-index");
        if (destinos[idx].cantidad > 1) {
          destinos[idx].cantidad -= 1;
        }
        localStorage.setItem("carritoViajes", JSON.stringify(destinos));
        BuscarDestinos();
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
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