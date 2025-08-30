document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  const form = document.getElementById("viajeForm");
  const inputs = form.querySelectorAll("input, select");
  const submitBtn = document.getElementById("submitBtn");

  function validateField(field) {
    const errorMsg = field.parentElement.querySelector(".error");
    let valid = true;

    if (!field.value.trim()) {
      errorMsg.textContent = "Este campo es obligatorio";
      errorMsg.style.display = "block";
      valid = false;
    } else if (field.id === "telefono" && !/^\d{10}$/.test(field.value)) {
      errorMsg.textContent = "Ingrese un teléfono válido (10 dígitos)";
      errorMsg.style.display = "block";
      valid = false;
    } else {
      errorMsg.textContent = "";
      errorMsg.style.display = "none";
    }

    return valid;
  }

  function checkForm() {
    let allValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) allValid = false;
    });
    submitBtn.disabled = !allValid;
  }

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      validateField(input);
      checkForm();
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("¡Reserva realizada con éxito!");
    form.reset();
    submitBtn.disabled = true;
  });
});
