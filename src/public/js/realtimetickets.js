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
  const ticketList = document.getElementById("listTickets");
  const cancelOp = document.getElementById("cancelOp");
  const orderDetails = document.getElementById("orderDetails");

  socket.on("Ticket Change", (ticketinfo) => {
    const existingTicket = document.getElementById(ticketinfo._id);

    if (!ticketinfo.readableDate) {
      const date = new Date(ticketinfo.purchase_datetime);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      ticketinfo.readableDate = date
        .toLocaleDateString("es-ES", options)
        .replace(",", "");
    }

    if (existingTicket) {
      existingTicket.innerHTML = innerHTMLtext(ticketinfo);
    } else {
      // Agregar nuevo producto a la lista
      const newTicketItem = document.createElement("div");

      newTicketItem.setAttribute("id", ticketinfo._id);
      newTicketItem.classList.add("productoBox");
      newTicketItem.innerHTML = innerHTMLtext(ticketinfo);
      ticketList.appendChild(newTicketItem);
    }
  });

  cancelOp.style.display = "none";

  cancelOp.addEventListener("click", () => {
    orderDetails.style.display = "none";
    cancelOp.style.display = "none";
    ticketList.style.display = "inline";
  });

  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-ticket")) {
      const ticketId = event.target.getAttribute("data-ticket-id");
      orderDetails.style.display = "inline";
      cancelOp.style.display = "inline";
      ticketList.style.display = "none";

      try {
        const response = await fetch(`/api/tickets/${ticketId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let { payload: ticketData } = await response.json();

        if (!ticketData.readableDate) {
          const date = new Date(ticketData.purchase_datetime);
          const options = { day: "2-digit", month: "short", year: "numeric" };
          ticketData.readableDate = date
            .toLocaleDateString("es-ES", options)
            .replace(",", "");
        }

        // Popular los datos del ticket en los elementos HTML
        document.getElementById(
          "detalle"
        ).innerHTML = `Detalles del Pedido ${ticketData.code}`;
        document.getElementById(
          "codigo"
        ).innerHTML = `<strong>Código:</strong> ${ticketData.code}`;
        document.getElementById(
          "usuario"
        ).innerHTML = `<strong>Usuario:</strong> ${ticketData.user.email}`;
        document.getElementById(
          "fecha"
        ).innerHTML = `<strong>Fecha de Pedido:</strong> ${ticketData.readableDate}`;
        document.getElementById(
          "estado"
        ).innerHTML = `<strong>Estado:</strong> ${ticketData.status}`;
        document.getElementById("total").innerHTML = `<strong>Total:</strong>
      $${ticketData.amount}`;

        const updateStatusButton =
          document.getElementById("updateStatusButton");
        updateStatusButton.setAttribute("data-ticket-id", ticketData._id);
        // Llenar el cuerpo de la tabla con los productos del ticket
        const tbody = document.getElementById("tbody");
        tbody.innerHTML = ""; // Limpiar la tabla actual

        ticketData.products.forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td>${product.title}</td>
          <td class="center">${product.quantity}</td>
          <td>$${product.price}</td>
          <td>$${product.totalProduct}</td>
        `;
          tbody.appendChild(row);
        });

        //Se popula, ahora manejo de data
        const statusSelect = document.getElementById("statusSelect");
        let selectedStatus = statusSelect.value;
        statusSelect.value = ticketData.status;

        updateStatusButton.addEventListener("click", async (event) => {
          selectedStatus = statusSelect.value;
          const responsePut = await fetch(`/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: selectedStatus }),
          });
          if (!responsePut.ok) {
            throw new Error(`Error actualizando el estado: ${response.status}`);
          }
          const { payload: data } = await responsePut.json();
          tostada("Estado actualizado correctamente.");

          orderDetails.style.display = "none";
          cancelOp.style.display = "none";
          ticketList.style.display = "inline";

          socket.emit("Ticket Change", data);
        });

        ////
      } catch (error) {
        tostada("Error al procesar pedido.");
        console.error("Error al obtener los datos del pedido:", error.message);
      }
    }
  });

  ///acá
});

function innerHTMLtext(ticket) {
  return `<p class="flex2u">
              Código:
              ${ticket.code}
            </p>
            <p class="flex5u">Usuario: ${ticket.user.email}</p>
            <p class="flex2u">
              Fecha de Pedido:
              ${ticket.readableDate}
            </p>
            <p class="flex3u">
              Total: $${ticket.amount}
            </p>
            <p class="flex6u">Estado: ${ticket.status}</p>

            <button
              type="button"
              class="btn-ticket flex6u"
              data-ticket-id="${ticket._id}"
            >Administrar Pedido</button>
    `;
}
