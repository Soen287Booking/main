document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resource-form");
  const tableBody = document.getElementById("resource-table-body");
  const msg = document.getElementById("message");

  const idField = document.getElementById("resource-id");
  const titleField = document.getElementById("resource-title");
  const categoryField = document.getElementById("resource-category");
  const locationField = document.getElementById("resource-location");
  const capacityField = document.getElementById("resource-capacity");
  const availabilityField = document.getElementById("resource-availability");
  const saveBtn = document.getElementById("save-resource-btn");
  const resetBtn = document.getElementById("reset-form-btn");

  let resources = JSON.parse(localStorage.getItem("resources")) || [];

  // ✅ Helper: Show temporary messages
  function showMessage(text) {
    msg.innerHTML = `<div class="alert alert-info" role="alert">${text}</div>`;
    setTimeout(() => { msg.innerHTML = ""; }, 3000);
  }

  // ✅ Display resource table
  function displayResources() {
    tableBody.innerHTML = "";

    if (resources.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-3">No resources available.</td>
        </tr>
      `;
      return;
    }

    resources.forEach((r, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.title}</td>
        <td>${r.category}</td>
        <td>${r.location}</td>
        <td>${r.capacity}</td>
        <td>
          <input type="checkbox" class="availability-toggle" data-index="${index}" ${r.availability === "true" ? "checked" : ""}>
          ${r.availability === "true" ? "✅ Available" : "❌ Not Available"}
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-secondary me-2 edit-btn" data-index="${index}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // ✅ Add/Update Resource
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleField.value.trim();
    const category = categoryField.value;
    const location = locationField.value.trim();
    const capacity = capacityField.value.trim();
    const availability = availabilityField.value;
    const editIndex = idField.value;

    if (!title || !category || !location || !capacity || !availability) {
      showMessage("Please fill in all fields.");
      return;
    }

    const resource = { title, category, location, capacity, availability };

    if (editIndex !== "") {
      resources[Number(editIndex)] = resource;
      showMessage("Resource updated successfully!");
    } else {
      resources.push(resource);
      showMessage("Resource added successfully!");
    }

    localStorage.setItem("resources", JSON.stringify(resources));
    displayResources();
    form.reset();
    idField.value = "";
    saveBtn.textContent = "Save Resource";
  });

  // ✅ Reset form
  resetBtn.addEventListener("click", () => {
    idField.value = "";
    saveBtn.textContent = "Save Resource";
  });

  // ✅ Edit Resource
  tableBody.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".edit-btn");
    if (!editBtn) return;

    const index = Number(editBtn.dataset.index);
    const r = resources[index];

    idField.value = index;
    titleField.value = r.title;
    categoryField.value = r.category;
    locationField.value = r.location;
    capacityField.value = r.capacity;
    availabilityField.value = r.availability;

    saveBtn.textContent = "Update Resource";
    showMessage("Editing mode activated.");
  });

  // ✅ Delete Resource
  tableBody.addEventListener("click", function (event) {
    const delBtn = event.target.closest(".delete-btn");
    if (!delBtn) return;

    const index = Number(delBtn.dataset.index);
    if (confirm("Delete this resource?")) {
      resources.splice(index, 1);
      localStorage.setItem("resources", JSON.stringify(resources));
      displayResources();
      showMessage("Resource deleted successfully!");
    }
  });

  // ✅ Toggle Availability (ON/OFF)
  tableBody.addEventListener("change", function (event) {
    if (!event.target.classList.contains("availability-toggle")) return;
    const index = event.target.getAttribute("data-index");
    const newState = event.target.checked ? "true" : "false";
    resources[index].availability = newState;
    localStorage.setItem("resources", JSON.stringify(resources));
    displayResources();
  });

  // ✅ Initial load
  displayResources();
});
