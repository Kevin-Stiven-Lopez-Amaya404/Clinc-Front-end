// Validaciones de frontend.
// Estas validaciones ayudan al usuario antes de enviar datos al backend.
document.addEventListener("DOMContentLoaded", () => {
  const patientForm = document.getElementById("patientForm");
  const doctorForm = document.getElementById("doctorForm");
  const appointmentForm = document.getElementById("appointmentForm");

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function mostrarError(input, mensaje) {
    limpiarError(input);

    input.classList.add("input-error");

    const error = document.createElement("small");
    error.className = "error-message";
    error.textContent = mensaje;

    const contenedor = input.closest(".input-box") || input.parentElement;
    contenedor.appendChild(error);
  }

  function limpiarError(input) {
    input.classList.remove("input-error");

    const contenedor = input.closest(".input-box") || input.parentElement;
    const error = contenedor.querySelector(".error-message");

    if (error) {
      error.remove();
    }
  }

  function limpiarFormulario(form) {
    form.querySelectorAll("input, select, textarea").forEach((campo) => limpiarError(campo));
  }

  function validarTexto(input, mensaje, minimo = 2) {
    const value = input.value.trim();

    if (!value) {
      mostrarError(input, mensaje);
      return false;
    }

    if (value.length < minimo) {
      mostrarError(input, `Debe tener mínimo ${minimo} caracteres.`);
      return false;
    }

    return true;
  }

  function validarEmail(input) {
    const value = input.value.trim();

    if (!value) {
      mostrarError(input, "El correo es obligatorio.");
      return false;
    }

    if (!emailValido(value)) {
      mostrarError(input, "Ingresa un correo válido.");
      return false;
    }

    return true;
  }

  patientForm.addEventListener(
    "submit",
    (event) => {
      limpiarFormulario(patientForm);

      const firstName = document.getElementById("patientFirstName");
      const lastName = document.getElementById("patientLastName");
      const documentNumber = document.getElementById("patientDocument");
      const phone = document.getElementById("patientPhone");
      const email = document.getElementById("patientEmail");

      let valido = true;

      valido = validarTexto(firstName, "El nombre es obligatorio.", 2) && valido;
      valido = validarTexto(lastName, "El apellido es obligatorio.", 2) && valido;
      valido = validarTexto(documentNumber, "El documento es obligatorio.", 5) && valido;
      valido = validarTexto(phone, "El teléfono es obligatorio.", 7) && valido;
      valido = validarEmail(email) && valido;

      if (!valido) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  doctorForm.addEventListener(
    "submit",
    (event) => {
      limpiarFormulario(doctorForm);

      const firstName = document.getElementById("doctorFirstName");
      const lastName = document.getElementById("doctorLastName");
      const specialty = document.getElementById("doctorSpecialty");
      const phone = document.getElementById("doctorPhone");
      const email = document.getElementById("doctorEmail");

      let valido = true;

      valido = validarTexto(firstName, "El nombre es obligatorio.", 2) && valido;
      valido = validarTexto(lastName, "El apellido es obligatorio.", 2) && valido;
      valido = validarTexto(specialty, "La especialidad es obligatoria.", 3) && valido;
      valido = validarTexto(phone, "El teléfono es obligatorio.", 7) && valido;
      valido = validarEmail(email) && valido;

      if (!valido) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  appointmentForm.addEventListener(
    "submit",
    (event) => {
      limpiarFormulario(appointmentForm);

      const appointmentDate = document.getElementById("appointmentDate");
      const appointmentPatient = document.getElementById("appointmentPatient");
      const appointmentDoctor = document.getElementById("appointmentDoctor");
      const reason = document.getElementById("appointmentReason");
      const diagnosis = document.getElementById("appointmentDiagnosis");
      const treatment = document.getElementById("appointmentTreatment");

      let valido = true;

      if (!appointmentDate.value) {
        mostrarError(appointmentDate, "La fecha y hora son obligatorias.");
        valido = false;
      }

      if (!appointmentPatient.value) {
        mostrarError(appointmentPatient, "Selecciona un paciente.");
        valido = false;
      }

      if (!appointmentDoctor.value) {
        mostrarError(appointmentDoctor, "Selecciona un doctor.");
        valido = false;
      }

      valido = validarTexto(reason, "El motivo es obligatorio.", 3) && valido;
      valido = validarTexto(diagnosis, "El diagnóstico es obligatorio.", 3) && valido;
      valido = validarTexto(treatment, "El tratamiento es obligatorio.", 3) && valido;

      if (!valido) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", () => limpiarError(input));
    input.addEventListener("change", () => limpiarError(input));
  });
});
