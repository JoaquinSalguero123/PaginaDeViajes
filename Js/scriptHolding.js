document.addEventListener("DOMContentLoaded", () => {
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
        <h5 > <b>Asientos</b></h5> 
        <h5 id="CantidadAsientos">${destino.Asientos}</h5>    
        <br>    
        <h5><b>Precio</b></h5> 
        <h5 id="PrecioImporte">${destino.Precio}</h5>
        <br>

      `;

      document.getElementById("destinosContainer").appendChild(div);


    });

  }catch(error){

  }

}

