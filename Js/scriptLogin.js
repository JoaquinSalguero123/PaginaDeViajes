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
