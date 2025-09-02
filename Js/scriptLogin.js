document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const btnLogin = document.getElementById("btnLogin");
  const btnRegister = document.getElementById("btnRegister");

  // Cambio entre login y registro
  const toggleForm = (showLogin) => {
    btnLogin.classList.toggle("active", showLogin);
    btnRegister.classList.toggle("active", !showLogin);
    loginForm.classList.toggle("hidden", !showLogin);
    registerForm.classList.toggle("hidden", showLogin);
  };

  btnLogin.addEventListener("click", () => toggleForm(true));
  btnRegister.addEventListener("click", () => toggleForm(false));

  // Validación básica de email
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita recarga de página
  
    // Validaciones manuales si querés
    const email = document.getElementById("Email").value;
    const confirmEmail = document.getElementById("EmailConfirmacion").value;
  
    if (email !== confirmEmail) {
      document.getElementById("mensajeMail").innerText = "❌ Los emails no coinciden";
      return;
    }
  
    await Registrar(); // función que hace el POST
  });
  
  // Slider de fondo
  let slides = document.querySelectorAll(".slide");
  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, 6000);
});

// ------------ Funciones auxiliares ----------------
const API_INGRESO = "https://68b229f1a860fe41fd6077dc.mockapi.io/Usuarios_Ingreso";
const API_DATOS   = "https://68b229f1a860fe41fd6077dc.mockapi.io/Usuarisos_Datos";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json();
}

// ------------ LOGIN ----------------
async function login() {
  const usuarioInput = document.getElementById("usuario").value.trim();
  const passwordInput = document.getElementById("password").value;

  try {
    const usuarios = await fetchJson(API_INGRESO);

    const usuarioEncontrado = usuarios.find(
      u => u.UserName === usuarioInput && u.Password === passwordInput
    );

    if (usuarioEncontrado) {
      window.location.href = "/pages/Holding.html";
    } else {
      document.getElementById("mensaje").innerText = "❌ Usuario o contraseña incorrectos";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("mensaje").innerText = "⚠️ Error al conectar con la API";
  }
}

// ------------ REGISTRO ----------------
async function Registrar() {

  const email = document.getElementById("Email").value;
  const confirmEmail = document.getElementById("EmailConfirmacion").value;

  const datosUsuario = {
    UserName: document.getElementById("UsuarioRegistrar").value.trim(),
    Password: document.getElementById("Password").value,
  };

  const datosPersonales = {
    Name: document.getElementById("Nombre").value,
    Surname: document.getElementById("Apellido").value,
    DNI: parseInt(document.getElementById("DNI").value, 10),
    Birthday: document.getElementById("FechaNacimiento").value,
    Gender: parseInt(document.getElementById("Genero").value, 10),
    Email: document.getElementById("Email").value
  };

  
  if (email !== confirmEmail) {
    document.getElementById("mensajeMail").innerText = "❌ Los emails no coinciden";
    return; // corta la ejecución, no sigue con el registro
  }

  try {
    const usuarios = await fetchJson(API_INGRESO);
    const existe = usuarios.some(u => u.UserName === datosUsuario.UserName);

    if (existe) {
      alert("El usuario ya existe");
      return;
    }

    // Guardar datos en ambas colecciones
    await Promise.all([
      fetch(API_DATOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosPersonales)
      }),
      fetch(API_INGRESO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario)
      })
    ]);

    window.location.href = "LoginUsers.html";
  } catch (error) {
    console.error(error);
    alert("⚠️ Error en el registro");
  }
}
