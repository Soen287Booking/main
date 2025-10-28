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

  let resources = [];

  // messages
  function showMessage(text) {
    msg.innerHTML = `<div class="alert alert-info" role="alert">${text}</div>`;
    setTimeout(() => { msg.innerHTML = ""; }, 3000);
  }

  // render table
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

    resources.forEach((resource, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${resource.title}</td>
        <td>${resource.category}</td>
        <td>${resource.location}</td>
        <td>${resource.capacity}</td>
        <td>${resource.availability}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-secondary me-2 edit-btn" data-index="${index}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // create or update
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleField.value.trim();
    const category = categoryField.value;
    const location = locationField.value.trim();
    const capacity = capacityField.value.trim();
    const availability = availabilityField.value;
    const editIndex = idField.value; // <-- define it

    if (!title || !category || !location || !capacity || !availability) {
      showMessage("Please fill in all fields.");
      return;
    }

    const resource = { title, category, location, capacity, availability };

    if (editIndex !== "") {
      // UPDATE
      resources[Number(editIndex)] = resource;
      localStorage.setItem("resources", JSON.stringify(resources));
      displayResources();
      showMessage("Resource updated successfully!");
      form.reset();
      idField.value = "";
      saveBtn.textContent = "Save Resource";
      return;
    }

    // CREATE
    resources.push(resource);
    localStorage.setItem("resources", JSON.stringify(resources));
    displayResources();
    showMessage("Resource added successfully!");
    form.reset();
  });

  // reset: exit edit mode
  resetBtn.addEventListener("click", () => {
    idField.value = "";
    saveBtn.textContent = "Save Resource";
  });

  // delete (event delegation)
  tableBody.addEventListener("click", function (event) {
    const delBtn = event.target.closest(".delete-btn");
    if (!delBtn) return;

    const index = Number(delBtn.dataset.index);
    resources.splice(index, 1);
    localStorage.setItem("resources", JSON.stringify(resources));
    displayResources();
    showMessage("Resource deleted successfully!");
  });

  // edit (event delegation)
  tableBody.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".edit-btn");
    if (!editBtn) return;

    const index = Number(editBtn.dataset.index);
    const r = resources[index];
    if (!r) return;

    idField.value = index;
    titleField.value = r.title || "";
    categoryField.value = r.category || "";
    locationField.value = r.location || "";
    capacityField.value = r.capacity || "";
    availabilityField.value = r.availability || "true";

    saveBtn.textContent = "Update Resource";
    showMessage("Editing mode: modify fields and click Update.");
  });

  // load from localStorage
  const storedResources = localStorage.getItem("resources");
  if (storedResources) {
    resources = JSON.parse(storedResources);
  }

  displayResources();
});