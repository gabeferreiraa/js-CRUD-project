let usersList = document.querySelector(".users-list");
let organizationsList = document.querySelector(".org-list");

window.onload = function () {
  initializeOrganizations();
  readUsers();
  readOrganizations();
};

const userURL = " https://random-data-api.com/api/v2/users?response_type=json";

async function getRandomUserImage() {
  let randomUserImage = null;
  try {
    const response = await fetch(userURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!data || !data.avatar) {
      console.log("No avatar found in the API response");
      return randomUserImage; // Exit if no avatar is found
    }

    randomUserImage = data.avatar;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
  return randomUserImage;
}

function readUsers() {
  usersList.innerHTML = "";

  // Fetch and parse stored data
  let masterUsers = localStorage.getItem("masterUsers");
  if (!masterUsers) {
    console.log("No user data available");
    return;
  }
  let masterUsersUser = JSON.parse(masterUsers);

  masterUsersUser.forEach((user, i) => {
    let tempClass =
      user.temp === "Hot" ? "hot" : user.temp === "Cold" ? "cold" : "warm";

    let tempEmoji =
      user.temp === "Hot" ? "🔥" : user.temp === "Cold" ? "❄️" : "☀️";

    // Initialize organization logos and names HTML
    let orgLogoHtml = "";
    let orgNameHtml = "";

    let elements = `
     
    `;
    usersList.innerHTML += elements;
  });
}

async function getLogoURL(orgName) {
  const encodedName = encodeURIComponent(orgName.trim());
  const logoURL = `https://logo.clearbit.com/${encodedName}.com`;
  try {
    const response = await fetch(logoURL);
    if (response.ok) {
      return logoURL;
    }
    throw new Error("Logo not found");
  } catch (error) {
    console.error("Error fetching logo:", error);
    return ""; // Return an empty string if the logo is not found
  }
}

async function addUserToOrganization(orgName) {
  let userFirstName = document.getElementById("user-first-name").value;
  let userLastName = document.getElementById("user-last-name").value;
  let userEmail = document.getElementById("user-add-email").value;

  let userID = Math.round(Math.random() * 10000);

  let newUser = {
    id: userID,
    first_name: userFirstName,
    last_name: userLastName,
    email: userEmail,
    organizations: [orgName],
  };

  let savedUsers = localStorage.getItem("masterUsers");
  let savedUsersJSON = savedUsers ? JSON.parse(savedUsers) : [];
  savedUsersJSON.push(newUser);
  localStorage.setItem("masterUsers", JSON.stringify(savedUsersJSON));

  let organizations = JSON.parse(localStorage.getItem("organizations"));
  organizations[orgName].users.push(userID);
  localStorage.setItem("organizations", JSON.stringify(organizations));

  // Update the modal content
  openOrganizationModal(orgName);
}

function initializeOrganizations() {
  if (!localStorage.getItem("organizations")) {
    localStorage.setItem("organizations", JSON.stringify({}));
  }
}

async function addUser(event) {
  event.preventDefault();

  let userInputFirstName = document.querySelector(
    "#user-add-input-first"
  ).value;
  let userInputLastName = document.querySelector("#user-add-input-last").value;
  let userEmail = document.querySelector("#user-email").value;
  let userOrganizations = document
    .querySelector("#user-organization-input")
    .value.split(",");

  let userImage = await getRandomUserImage();

  let userID = Math.round(Math.random() * 10000);

  var newUser = {
    id: userID,
    first_name: userInputFirstName,
    last_name: userInputLastName,
    email: userEmail,
    image: userImage,
    organizations: userOrganizations,
  };

  let savedUsers = localStorage.getItem("masterUsers");
  // "[{name: 'xyz', property: 'abcd' }]"

  const savedUsersJSON = savedUsers ? JSON.parse(savedUsers) : [];
  savedUsersJSON.push(newUser);

  localStorage.setItem("masterUsers", JSON.stringify(savedUsersJSON));

  userOrganizations.forEach((org) => {
    addUserToOrganization(newUser, org.trim());
  });

  readUsers();
}

function readOrganizations() {
  organizationsList.innerHTML = ""; // Clear the existing organizations

  let organizations = localStorage.getItem("organizations");
  if (!organizations) {
    console.log("No organization data available");
    return;
  }
  let masterOrganizations = JSON.parse(organizations);

  Object.keys(masterOrganizations).forEach((orgName) => {
    const organization = masterOrganizations[orgName];
    let tempClass =
      organization.temp === "Hot"
        ? "hot"
        : organization.temp === "Cold"
        ? "cold"
        : "warm";

    let tempEmoji =
      organization.temp === "Hot"
        ? "🔥"
        : organization.temp === "Cold"
        ? "❄️"
        : "☀️";

    let orgElements = `
      <div class="organization-card">
        <div class="organization-logo">
          <img class="org-logo" src="${
            organization.org_logo || "placeholder.png"
          }" alt="${orgName} logo" style="width:50px; height:50px;">
        </div>
        <div class="organization-info">
          <h2 class="organization-name">${orgName}</h2>
          <h4 class="organization-status">${organization.status}</h4>
        </div>
        <div class="organization-temp ${tempClass}">
          ${tempEmoji}
        </div>
        <div class="organization-expand" onclick="openOrganizationModal('${orgName}')">
          <img class="expand-logo" src="./icons8-fullscreen-48.png" alt="expand organization">
        </div>
      </div>
    `;
    organizationsList.innerHTML += orgElements;
  });
}

function openOrganizationModal(orgName) {
  let organizations = JSON.parse(localStorage.getItem("organizations"));
  let organization = organizations[orgName];

  document.getElementById("modal-org-name").textContent = organization.name;
  document.getElementById("modal-org-info").innerHTML = `
    <p>Status: ${organization.status}</p>
    <p>Temperature: ${organization.temp}</p>
  `;

  let usersListHtml = "<h3>Users in this organization:</h3>";
  if (organization.users.length > 0) {
    organization.users.forEach((userId) => {
      let masterUsers = JSON.parse(localStorage.getItem("masterUsers"));
      let user = masterUsers.find((u) => u.id === userId);
      usersListHtml += `<p>${user.first_name} ${user.last_name} - ${user.email}</p>`;
    });
  } else {
    usersListHtml += "<p>No users in this organization.</p>";
  }
  document.getElementById("modal-users-list").innerHTML = usersListHtml;

  document.getElementById("organization-modal").style.display = "block";

  document.getElementById("add-user-to-org-form").onsubmit = function (event) {
    event.preventDefault();
    addUserToOrganization(orgName);
  };
}
function closeOrganizationModal() {
  document.getElementById("organization-modal").style.display = "none";
}

function updateUserStatus(index, newStatus) {
  const savedUsers = localStorage.getItem("masterUsers");
  const usersArray = savedUsers ? JSON.parse(savedUsers) : [];

  if (!usersArray || usersArray.length <= index) {
    return;
  }
  // Update user status
  usersArray[index].status = newStatus;

  // Saving ...
  localStorage.setItem("masterUsers", JSON.stringify(usersArray));

  console.log("Updated user at index", index, ":", usersArray[index]);
  readUsers();
}
function updateUserTemp(index, newTemp) {
  const savedUsers = localStorage.getItem("masterUsers");
  const usersArray = savedUsers ? JSON.parse(savedUsers) : [];

  if (!usersArray || usersArray.length <= index) {
    return;
  }

  usersArray[index].temp = newTemp;

  // Saving ...
  localStorage.setItem("masterUsers", JSON.stringify(usersArray));
  readUsers();
}

document
  .getElementById("add-organization-form")
  .addEventListener("submit", addOrganization);

async function addOrganization(event) {
  event.preventDefault();

  let orgName = document.getElementById("org-name").value;
  let orgTemp = document.getElementById("org-temp").value;
  let orgStatus = document.getElementById("org-status").value;

  let orgLogo = await getLogoURL(orgName);

  let newOrg = {
    name: orgName,
    temp: orgTemp,
    status: orgStatus,
    org_logo: orgLogo,
    created_at: new Date().toISOString(),
    users: [],
  };

  let organizations = JSON.parse(localStorage.getItem("organizations")) || {};
  organizations[orgName] = newOrg;

  localStorage.setItem("organizations", JSON.stringify(organizations));
  console.log("New organization added:", newOrg);

  // Close the modal and refresh the organization list
  closeAddOrgModal();
  readOrganizations();
}

function prepareStatusUpdate(index) {
  currentUserIndex = index; //set global index
  openUpdateModal();
}
function prepareTempUpdate(index) {
  currentUserIndex = index; //set global index
  openUserTempModal();
}

let currentUserIndex = null;

function setUserTemp(button) {
  const newTemp = button.getAttribute("data-temp");
  updateUserTemp(currentUserIndex, newTemp);
  closeUserTempModal();
}
function setStatus(button) {
  const newStatus = button.getAttribute("data-status");
  updateUserStatus(currentUserIndex, newStatus);
  closeModalAndUpdate();
}

function openAddUserModal() {
  document.querySelector("#user-add-form").style.display = "flex";
  document.querySelector(".main-wrapper").style.display = "none";
  document.querySelector("#menu-wrapper").style.display = "none";
}
function openUserTempModal() {
  document.querySelector("#user-temp-form").style.display = "flex";
  document.querySelector(".main-wrapper").style.display = "none";
  document.querySelector("#menu-wrapper").style.display = "none";
}

function closeUserTempModal() {
  document.querySelector("#user-temp-form").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "grid";
  document.querySelector("#menu-wrapper").style.display = "flex";
}
function closeAddUserModal() {
  document.querySelector("#user-add-form").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "grid";
  document.querySelector("#menu-wrapper").style.display = "block";
}

function openUpdateModal() {
  document.querySelector("#update-modal").style.display = "flex";
  document.querySelector(".main-wrapper").style.display = "none";
  document.querySelector("#menu-wrapper").style.display = "none";
}

function closeModalAndUpdate() {
  document.querySelector("#update-modal").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "grid";
  document.querySelector("#menu-wrapper").style.display = "flex";
}

function openAddOrgModal() {
  document.querySelector("#org-add-form").style.display = "flex";
  document.querySelector(".main-wrapper").style.display = "none";
  document.querySelector("#menu-wrapper").style.display = "none";
}

function closeAddOrgModal() {
  document.querySelector("#org-add-form").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "grid";
  document.querySelector("#menu-wrapper").style.display = "flex";
}

// let elements = `
//         <div class="organization-card">
//              <div class="user-image-wrapper"><img class="user-image" src=${user.image}></div>
//              <div class="user-content">
//                 <div class="org-logo-wrapper">${orgLogoHtml}</div>
//              </div>
//              <div class="user-status">
//                  <div class="user-status-circle"></div>
//                  ${user.status}
//                  <i class="user-update" onclick="prepareStatusUpdate(${i})">
//                      <img class="user-update-icon" src="./icons8-pencil-48.png" alt="update user">
//                  </i>
//              </div>
//              <div class="user-temp-wrapper ${tempClass}">
//                  <div>${user.temp}</div>
//                  <i class="user-temp" onclick="prepareTempUpdate(${i})">
//                      <img class="user-temp-icon" src="./icons8-pencil-48.png" alt="update temp">
//                  </i>
//              </div>
//              <i class="user-delete" onclick="deleteUser(${i})">
//                  <img class="user-delete-icon" src="./delete.png" alt="delete user">
//              </i>
//          </div>
//          `;
