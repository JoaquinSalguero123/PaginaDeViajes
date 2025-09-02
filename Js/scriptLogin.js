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
  const inputUsuario = document.getElementById("UsuarioRegistrar");
  const inputNombre = document.getElementById("Nombre");
  const inputApellido = document.getElementById("Apellido");
  const inputDNI = document.getElementById("DNI");
  const inputFechaNacimiento = document.getElementById("FechaNacimiento");
  const inputGenero = document.getElementById("Genero");
  const inputEmail = document.getElementById("Email");
  const inputEmailConfirmacion = document.getElementById("EmailConfirmacion");
  const inputPassword = document.getElementById("Password");
  let registroAprobado = 0;

  inputEmailConfirmacion.addEventListener("input", function(){
    const value = inputEmail.value.trim();
    const valueConfirmacion = inputEmailConfirmacion.value.trim();
    const mensaje = document.getElementById("mensajeMail");

    if (value !== valueConfirmacion) {
      inputEmailConfirmacion.classList.add("error");
      mensaje.innerText = "❌ Los emails no coinciden";
      registroAprobado = 0;
    }else{
      inputEmailConfirmacion.classList.remove("error");
      mensaje.innerText = "";
      registroAprobado = 1;
    }
  })

  inputPassword.addEventListener("input", function(){
    const value = inputPassword.value;
    const mensaje = document.getElementById("mensajePassword");

    if (value.length < 6) {
      inputPassword.classList.add("error");
      mensaje.innerText = "❌ La contraseña debe tener al menos 6 caracteres";
      registroAprobado = 0;
    }else{
      inputPassword.classList.remove("error");
      mensaje.innerText = "";
      registroAprobado = 1;
    }
  })

  // Función de validación y registro
  window.ValidarYRegistrar = function() {
    // Validaciones
    if (!inputUsuario.value || !inputNombre.value || !inputApellido.value || !inputDNI.value || !inputFechaNacimiento.value || !inputGenero.value || !inputEmail.value || !inputEmailConfirmacion.value || !inputPassword.value) {
      alert("❌ Todos los campos son obligatorios") ;
      registroAprobado = 0;
      return;
    }

    if (!/^\d+$/.test(inputDNI.value.trim())) {
      alert( "❌ DNI debe contener solo números");
      registroAprobado = 0;
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail.value.trim())) {
      alert( "❌ Email no es válido");
      registroAprobado = 0;
      return;
    }
    registroAprobado = 1;

    // Si todo está bien, proceder al registro
    if (registroAprobado === 1) {
      Registrar();
    }

  };

  // Inicialmente mostrar login
  btnLogin.addEventListener("click", () => toggleForm(true));
  btnRegister.addEventListener("click", () => toggleForm(false));

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
      const inputUsuario = document.getElementById("UsuarioRegistrar");
      inputUsuario.focus();
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
