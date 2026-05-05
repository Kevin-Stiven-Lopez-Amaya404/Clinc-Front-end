// URL base del backend.
// Local: usa Spring Boot en localhost.
// Producción: reemplaza PRODUCTION_API_URL por la URL real del backend en Render.

//const LOCAL_API_URL = "http://localhost:8080/api";
const PRODUCTION_API_URL = "https://clinc-back-end.onrender.com/api";

const API_URL = PRODUCTION_API_URL; // Cambia a LOCAL_API_URL para desarrollo local.

const patientForm = document.getElementById("patientForm");
const doctorForm = document.getElementById("doctorForm");
const appointmentForm = document.getElementById("appointmentForm");

const patientList = document.getElementById("patientList");
const doctorList = document.getElementById("doctorList");
const appointmentTable = document.getElementById("appointmentTable");

const patientId = document.getElementById("patientId");
const patientFirstName = document.getElementById("patientFirstName");
const patientLastName = document.getElementById("patientLastName");
const patientDocument = document.getElementById("patientDocument");
const patientPhone = document.getElementById("patientPhone");
const patientEmail = document.getElementById("patientEmail");
const patientFormTitle = document.getElementById("patientFormTitle");
const patientSubmitBtn = document.getElementById("patientSubmitBtn");
const cancelPatientEditBtn = document.getElementById("cancelPatientEditBtn");

const doctorId = document.getElementById("doctorId");
const doctorFirstName = document.getElementById("doctorFirstName");
const doctorLastName = document.getElementById("doctorLastName");
const doctorSpecialty = document.getElementById("doctorSpecialty");
const doctorPhone = document.getElementById("doctorPhone");
const doctorEmail = document.getElementById("doctorEmail");
const doctorFormTitle = document.getElementById("doctorFormTitle");
const doctorSubmitBtn = document.getElementById("doctorSubmitBtn");
const cancelDoctorEditBtn = document.getElementById("cancelDoctorEditBtn");

const appointmentId = document.getElementById("appointmentId");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentPatient = document.getElementById("appointmentPatient");
const appointmentDoctor = document.getElementById("appointmentDoctor");
const appointmentReason = document.getElementById("appointmentReason");
const appointmentDiagnosis = document.getElementById("appointmentDiagnosis");
const appointmentTreatment = document.getElementById("appointmentTreatment");
const appointmentFormTitle = document.getElementById("appointmentFormTitle");
const appointmentSubmitBtn = document.getElementById("appointmentSubmitBtn");
const cancelAppointmentEditBtn = document.getElementById("cancelAppointmentEditBtn");
const refreshBtn = document.getElementById("refreshBtn");

let patients = [];
let doctors = [];
let appointments = [];

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = "Error en la petición al backend";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      // Si no hay JSON, se conserva el mensaje por defecto.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function loadData() {
  try {
    patients = await request("/patients");
    doctors = await request("/doctors");
    appointments = await request("/appointments");

    renderPatients();
    renderDoctors();
    renderAppointments();
  } catch (error) {
    alert("No se pudo conectar con el backend. Verifica que Spring Boot esté corriendo o revisa la URL en app.js.");
  }
}

function fullName(person) {
  return `${person.firstName} ${person.lastName}`;
}

function toDateTimeLocal(value) {
  if (!value) return "";
  return value.substring(0, 16);
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-CO");
}

function renderPatients() {
  patientList.innerHTML = "";
  appointmentPatient.innerHTML = '<option value="">Seleccione paciente</option>';

  if (patients.length === 0) {
    patientList.innerHTML = '<div class="empty-state">No hay pacientes registrados.</div>';
    return;
  }

  patients.forEach((patient) => {
    patientList.innerHTML += `
      <div class="list-group-item">
        <div>
          <strong>${fullName(patient)}</strong>
          <br>
          <small class="text-muted">Doc: ${patient.documentNumber} • ${patient.email}</small>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-warning" onclick="editPatient(${patient.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deletePatient(${patient.id})"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;

    appointmentPatient.innerHTML += `<option value="${patient.id}">${fullName(patient)}</option>`;
  });
}

function renderDoctors() {
  doctorList.innerHTML = "";
  appointmentDoctor.innerHTML = '<option value="">Seleccione doctor</option>';

  if (doctors.length === 0) {
    doctorList.innerHTML = '<div class="empty-state">No hay doctores registrados.</div>';
    return;
  }

  doctors.forEach((doctor) => {
    doctorList.innerHTML += `
      <div class="list-group-item">
        <div>
          <strong>${fullName(doctor)}</strong>
          <br>
          <small class="text-muted">${doctor.specialty} • ${doctor.email}</small>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-warning" onclick="editDoctor(${doctor.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${doctor.id})"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;

    appointmentDoctor.innerHTML += `<option value="${doctor.id}">${fullName(doctor)} - ${doctor.specialty}</option>`;
  });
}

function renderAppointments() {
  appointmentTable.innerHTML = "";

  if (appointments.length === 0) {
    appointmentTable.innerHTML = '<tr><td colspan="8" class="empty-state">No hay citas médicas registradas.</td></tr>';
    return;
  }

  appointments.forEach((appointment) => {
    appointmentTable.innerHTML += `
      <tr>
        <td>${appointment.id}</td>
        <td>${formatDate(appointment.appointmentDate)}</td>
        <td>${fullName(appointment.patient)}</td>
        <td>${fullName(appointment.doctor)}</td>
        <td>${appointment.reason}</td>
        <td>${appointment.diagnosis}</td>
        <td>${appointment.treatment}</td>
        <td>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning" onclick="editAppointment(${appointment.id})"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${appointment.id})"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  });
}

patientForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    firstName: patientFirstName.value.trim(),
    lastName: patientLastName.value.trim(),
    documentNumber: patientDocument.value.trim(),
    phone: patientPhone.value.trim(),
    email: patientEmail.value.trim(),
  };

  try {
    if (patientId.value) {
      await request(`/patients/${patientId.value}`, { method: "PUT", body: JSON.stringify(data) });
    } else {
      await request("/patients", { method: "POST", body: JSON.stringify(data) });
    }

    resetPatientForm();
    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

function editPatient(id) {
  const patient = patients.find((item) => item.id === id);
  if (!patient) return;

  patientId.value = patient.id;
  patientFirstName.value = patient.firstName;
  patientLastName.value = patient.lastName;
  patientDocument.value = patient.documentNumber;
  patientPhone.value = patient.phone;
  patientEmail.value = patient.email;

  patientFormTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Actualizar paciente';
  patientSubmitBtn.textContent = "Actualizar paciente";
  cancelPatientEditBtn.classList.remove("hidden");
  patientFirstName.focus();
}

async function deletePatient(id) {
  const patient = patients.find((item) => item.id === id);
  const confirmDelete = confirm(`¿Seguro que quieres eliminar al paciente ${patient ? fullName(patient) : ""}?`);
  if (!confirmDelete) return;

  try {
    await request(`/patients/${id}`, { method: "DELETE" });
    await loadData();
  } catch (error) {
    alert("No se pudo eliminar el paciente. Puede tener citas asociadas.");
  }
}

function resetPatientForm() {
  patientForm.reset();
  patientId.value = "";
  patientFormTitle.innerHTML = '<i class="bi bi-people me-2"></i>Pacientes';
  patientSubmitBtn.textContent = "Guardar paciente";
  cancelPatientEditBtn.classList.add("hidden");
}

doctorForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    firstName: doctorFirstName.value.trim(),
    lastName: doctorLastName.value.trim(),
    specialty: doctorSpecialty.value.trim(),
    phone: doctorPhone.value.trim(),
    email: doctorEmail.value.trim(),
  };

  try {
    if (doctorId.value) {
      await request(`/doctors/${doctorId.value}`, { method: "PUT", body: JSON.stringify(data) });
    } else {
      await request("/doctors", { method: "POST", body: JSON.stringify(data) });
    }

    resetDoctorForm();
    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

function editDoctor(id) {
  const doctor = doctors.find((item) => item.id === id);
  if (!doctor) return;

  doctorId.value = doctor.id;
  doctorFirstName.value = doctor.firstName;
  doctorLastName.value = doctor.lastName;
  doctorSpecialty.value = doctor.specialty;
  doctorPhone.value = doctor.phone;
  doctorEmail.value = doctor.email;

  doctorFormTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Actualizar doctor';
  doctorSubmitBtn.textContent = "Actualizar doctor";
  cancelDoctorEditBtn.classList.remove("hidden");
  doctorFirstName.focus();
}

async function deleteDoctor(id) {
  const doctor = doctors.find((item) => item.id === id);
  const confirmDelete = confirm(`¿Seguro que quieres eliminar al doctor ${doctor ? fullName(doctor) : ""}?`);
  if (!confirmDelete) return;

  try {
    await request(`/doctors/${id}`, { method: "DELETE" });
    await loadData();
  } catch (error) {
    alert("No se pudo eliminar el doctor. Puede tener citas asociadas.");
  }
}

function resetDoctorForm() {
  doctorForm.reset();
  doctorId.value = "";
  doctorFormTitle.innerHTML = '<i class="bi bi-person-badge me-2"></i>Doctores';
  doctorSubmitBtn.textContent = "Guardar doctor";
  cancelDoctorEditBtn.classList.add("hidden");
}

appointmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    appointmentDate: appointmentDate.value,
    reason: appointmentReason.value.trim(),
    diagnosis: appointmentDiagnosis.value.trim(),
    treatment: appointmentTreatment.value.trim(),
    patientId: Number(appointmentPatient.value),
    doctorId: Number(appointmentDoctor.value),
  };

  try {
    if (appointmentId.value) {
      await request(`/appointments/${appointmentId.value}`, { method: "PUT", body: JSON.stringify(data) });
    } else {
      await request("/appointments", { method: "POST", body: JSON.stringify(data) });
    }

    resetAppointmentForm();
    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

function editAppointment(id) {
  const appointment = appointments.find((item) => item.id === id);
  if (!appointment) return;

  appointmentId.value = appointment.id;
  appointmentDate.value = toDateTimeLocal(appointment.appointmentDate);
  appointmentPatient.value = appointment.patient.id;
  appointmentDoctor.value = appointment.doctor.id;
  appointmentReason.value = appointment.reason;
  appointmentDiagnosis.value = appointment.diagnosis;
  appointmentTreatment.value = appointment.treatment;

  appointmentFormTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Actualizar cita médica';
  appointmentSubmitBtn.textContent = "Actualizar cita médica";
  cancelAppointmentEditBtn.classList.remove("hidden");

  appointmentForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function deleteAppointment(id) {
  const confirmDelete = confirm("¿Seguro que quieres eliminar esta cita médica?");
  if (!confirmDelete) return;

  try {
    await request(`/appointments/${id}`, { method: "DELETE" });
    await loadData();
  } catch (error) {
    alert(error.message);
  }
}

function resetAppointmentForm() {
  appointmentForm.reset();
  appointmentId.value = "";
  appointmentFormTitle.innerHTML = '<i class="bi bi-calendar-plus me-2"></i>Crear cita médica';
  appointmentSubmitBtn.textContent = "Guardar cita médica";
  cancelAppointmentEditBtn.classList.add("hidden");
}

cancelPatientEditBtn.addEventListener("click", resetPatientForm);
cancelDoctorEditBtn.addEventListener("click", resetDoctorForm);
cancelAppointmentEditBtn.addEventListener("click", resetAppointmentForm);
refreshBtn.addEventListener("click", loadData);

loadData();