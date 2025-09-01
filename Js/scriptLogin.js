document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const btnLogin = document.getElementById("btnLogin");
  const btnRegister = document.getElementById("btnRegister");

  // Cambio entre login y registro
  btnLogin.addEventListener("click", () => {
    btnLogin.classList.add("active");
    btnRegister.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  btnRegister.addEventListener("click", () => {
    btnRegister.classList.add("active");
    btnLogin.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // Validación básica de email
  registerForm.addEventListener("submit", (e) => {
    const email = document.getElementById("Email").value;
    const confirmEmail = document.getElementById("EmailConfirmacion").value;
    if (email !== confirmEmail) {
      e.preventDefault();
      alert("Los emails no coinciden. REVISAR");
    }
  });

  // Slider de fondo
  let slides = document.querySelectorAll(".slide");
  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, 6000); // cada 6s cambia la imagen
  
});

//Traer usuario desde MockAPI, falta realizarlo a partir de variables
const url = 'https://68b229f1a860fe41fd6077dc.mockapi.io/Usuarios_Ingreso';

try {
  const response = await fetch(url);
  const result = await response.json();
  
  const usuario = result.filter(u => u.UserName === 'Administrador' && u.Password === '12345678');
  
  console.log(usuario);
} catch (error) {
  console.error(error);
}
/*
async function login() {
  const usuarioInput = document.getElementById("usuario").value;
  const passwordInput = document.getElementById("password").value;

  const url = 'https://68b229f1a860fe41fd6077dc.mockapi.io/Usuarios_Ingreso';

  try {
    const response = await fetch(url);
    const usuarios = await response.json();

    // Buscar si existe coincidencia
    const usuarioEncontrado = usuarios.find(
      u => u.UserName === usuarioInput && u.Password === passwordInput
    );

    if (usuarioEncontrado) {
      document.getElementById("mensaje").innerText = "✅ Login exitoso, bienvenido " + usuarioEncontrado.UserName;
    } else {
      document.getElementById("mensaje").innerText = "❌ Usuario o contraseña incorrectos";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("mensaje").innerText = "⚠️ Error al conectar con la API";
  }
}*/