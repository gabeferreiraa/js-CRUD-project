// let users = [
//   {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     status: "Prospect",
//   },
//   {
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     status: "Outbound",
//   },
//   {
//     name: "Sam Johnson",
//     email: "sam.johnson@example.com",
//     status: "Conversation",
//   },
//   {
//     name: "Emily Turner",
//     email: "emily.turner@example.com",
//     status: "Demo",
//   },
//   {
//     name: "Alex Lee",
//     email: "alex.lee@example.com",
//     status: "Sale",
//   },
//   {
//     name: "Laura Brown",
//     email: "laura.brown@example.com",
//     status: "Dead",
//   },
// ];
// localStorage.setItem("object", JSON.stringify(users));

let usersList = document.querySelector(".main-wrapper");

window.onload = readUsers();

function readUsers() {
  usersList.innerHTML = "";

  let object = localStorage.getItem("object");
  if (!object) {
    return;
  }
  let objectUser = JSON.parse(object);

  objectUser.forEach((user, i) => {
    let elements = `
        <div class="user-card">
            <div class="user-image"><img src="" alt=""></div>
            <div class="user-name">${user.name}</div>
            <div class="user-status">
              <div class="user-status-circle"></div>
              ${user.status}
              
            </div>
            <i class="user-delete" onclick="deleteUser(${i})">
                <img class="user-delete-icon" src="./delete.png" alt="delete user">
            </i>
        </div>
        `;
    usersList.innerHTML += elements;
  });
}

function deleteUser(index) {
  let savedUsers = localStorage.getItem("object");
  const savedUsersJSON = savedUsers ? JSON.parse(savedUsers) : [];

  if (!savedUsersJSON) {
    return;
  }
  // This is deleting...
  const arrayAfterDeletion = savedUsersJSON.filter((element, i) => {
    if (i != index) {
      return element;
    }
  });
  // Deleting is done

  localStorage.setItem("object", JSON.stringify(arrayAfterDeletion));
  console.log(arrayAfterDeletion);

  readUsers();
}

function addUser(event) {
  let userInputName = document.querySelector("#user-add-input").value;
  let userStatus = document.querySelector("#user-status-selection").value;

  let newUser = {
    name: userInputName,
    status: userStatus,
  };
  // users.push(newUser);
  let savedUsers = localStorage.getItem("object");
  // "[{name: 'xyz', property: 'abcd' }]"

  const savedUsersJSON = savedUsers ? JSON.parse(savedUsers) : [];
  savedUsersJSON.push(newUser);

  localStorage.setItem("object", JSON.stringify(savedUsersJSON));

  readUsers();
}

const userInputForm = document.querySelector("#user-add-form");
userInputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addUser();
  // console.log(users);
});
