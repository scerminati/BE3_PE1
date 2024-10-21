// Conectar al servidor de Socket.io
const socket = io();

// Escuchar eventos de conexión y desconexión
socket.on("connect", () => {
  console.log("Admin conectado al servidor");
});

socket.on("disconnect", () => {
  console.log("Admin desconectado del servidor");
});

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async function () {
  const userList = document.getElementById("listado");

  socket.on("User Change", (userinfo) => {
    const existingUser = document.getElementById(userinfo._id);

    if (existingUser) {
      existingUser.innerHTML = innerHTMLtext(userinfo);
    } else {
      // Agregar nuevo producto a la lista
      const newUsertItem = document.createElement("div");

      newUsertItem.setAttribute("id", userinfo._id);
      newUsertItem.classList.add("productoBox");
      newUsertItem.innerHTML = innerHTMLtext(userinfo);
      userList.appendChild(newUsertItem);
    }
  });

  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-user")) {
      const userId = event.target.getAttribute("data-user-id");

      try {
        const response = await fetch(`/api/users/${userId}/makeUser`, {
          method: "PUT",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let { payload: newUser } = await response.json();

        // Emitir evento de eliminación de producto a través de Socket.io
        socket.emit("User Change", newUser);
        tostada("Nuevo rol de Usuario");
      } catch (error) {
        tostada("Error al cambiar el rol.");
        console.error("Error al cambiar de rol", error.message);
      }
    }
  });

  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-admin")) {
      const userId = event.target.getAttribute("data-user-id");

      try {
        const response = await fetch(`/api/users/${userId}/makeAdmin`, {
          method: "PUT",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let { payload: newUser } = await response.json();

        // Emitir evento de eliminación de producto a través de Socket.io
        socket.emit("User Change", newUser);
        tostada("Nuevo rol de Administrador");
      } catch (error) {
        tostada("Error al cambiar el rol.");
        console.error("Error al cambiar de rol", error.message);
      }
    }
  });
});

function innerHTMLtext(user) {
  return `<p class="flex1u">Email: ${user.email}</p>
            <p class="flex2u">
              Nombre:
              ${user.first_name}
            </p>
            <p class="flex2u">
              Apellido:
              ${user.last_name}
            </p>
            <p class="flex3u">
              Edad:
              ${user.age}
            </p>
            <p class="flex3u"> Rol: ${user.role} </p>
            ${
              user.role === "admin"
                ? `<button
                    type="button"
                    class="btn-user flex4u"
                    data-user-id="${user._id}"
                  >Hacer Usuario</button>`
                : `<button
                    type="button"
                    class="btn-admin flex4u"
                    data-user-id="${user._id}"
                  >Hacer Admin</button>`
            }
    `;
}
