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

    // Deshabilitar inputs del formulario oculto para evitar errores de required
    loginForm.querySelectorAll("input, select").forEach(input => input.disabled = !showLogin);
    registerForm.querySelectorAll("input, select").forEach(input => input.disabled = showLogin);
  };

  //Prueba de mail y foco
  const inputEmail = document.getElementById("Email");
  const inputEmailConfirmacion = document.getElementById("EmailConfirmacion");

  inputEmailConfirmacion.addEventListener("input", function(){
    const value = inputEmail.value.trim();
    const valueConfirmacion = inputEmailConfirmacion.value.trim();

    if (value !== valueConfirmacion) {
      inputEmailConfirmacion.classList.add("error");
    }else{
      inputEmailConfirmacion.classList.remove("error");
    }
  })

  btnLogin.addEventListener("click", () => toggleForm(true));
  btnRegister.addEventListener("click", () => toggleForm(false));

  // Función de validación y registro
  window.ValidarYRegistrar = function() {
    const mensajeMail = document.getElementById("mensajeMail");
    const mensajePassword = document.getElementById("mensajePassword");
    mensajeMail.innerText = "";
    mensajePassword.innerText = "";

    const usuario = document.getElementById("UsuarioRegistrar").value.trim();
    const nombre = document.getElementById("Nombre").value.trim();
    const apellido = document.getElementById("Apellido").value.trim();
    const dni = document.getElementById("DNI").value.trim();
    const fechaNacimiento = document.getElementById("FechaNacimiento").value;
    const genero = document.getElementById("Genero").value;
    const password = document.getElementById("Password");

    confirmEmail.classList.remove("error")
    password.classList.remove("error")
    // Validaciones
    if (!usuario || !nombre || !apellido || !dni || !fechaNacimiento || !genero || !email || !confirmEmail || !password) {
      alert("❌ Todos los campos son obligatorios") ;
      return;
    }

    if (!/^\d+$/.test(dni)) {
      alert( "❌ DNI debe contener solo números");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert( "❌ Email no es válido");
      return;
    }

    if (email !== confirmEmail.value.trim()) {
      mensajeMail.innerText = "❌ Los emails no coinciden";
      confirmEmail.classList.add("error")
      return;
    }

    if (password.value.length < 6) {
      mensajePassword.innerText = "❌ La contraseña debe tener al menos 6 caracteres";
      password.classList.add("error")
      return;
    }

    // Si todo es correcto, llamar a la función de registro
    Registrar();
  };

  // Slider de fondo
  let slides = document.querySelectorAll(".slide");
  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, 6000);
});

// ------------ Funciones auxiliares y API ----------------
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
  const mensaje = document.getElementById("mensaje");

  try {
    const usuarios = await fetchJson(API_INGRESO);
    const usuarioEncontrado = usuarios.find(
      u => u.UserName === usuarioInput && u.Password === passwordInput
    );

    if (usuarioEncontrado) {
      window.location.href = "/pages/Holding.html";
    } else {
      mensaje.innerText = "❌ Usuario o contraseña incorrectos";
    }
  } catch (error) {
    console.error(error);
    mensaje.innerText = "⚠️ Error al conectar con la API";
  }
}

// ------------ REGISTRO ----------------
async function Registrar() {
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

  try {
    const usuarios = await fetchJson(API_INGRESO);
    if (usuarios.some(u => u.UserName === datosUsuario.UserName)) {
      alert(`El nombre de usuario "${datosUsuario.UserName}" ya existe`);
      return;
    }

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
