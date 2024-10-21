import __dirname from "../main/dirnameUtils.js";

export async function emailBody(user, products, amount, code, future) {
  // Función para formatear como moneda
  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  // Crear las filas dinámicamente con los productos procesados
  const productRows = products
    .map((product) => {
      return `
          <tr>
            <td style="text-align: center;">${product.title}</td>
            <td style="text-align: center;">${product.quantity}</td>
            <td style="text-align: center;">${formatCurrency(
              product.price
            )}</td>
            <td style="text-align: center;">${formatCurrency(
              product.totalProduct
            )}</td>
          </tr>
        `;
    })
    .join("");

  // Inicializar variable para productos fallidos
  let failedProductRows = "";

  // Crear las filas dinámicamente para los productos que no pudieron procesarse
  if (future && future.length > 0) {
    failedProductRows = future
      .map((item) => {
        return `
          <tr>
            <td style="text-align: center;">${item.product.title}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: center;">${item.product.stock}</td>
          </tr>
        `;
      })
      .join("");
  }

  // Verificar si hay productos fallidos
  const failedProductsSection = failedProductRows
    ? `
    <hr />
    <h3>¡Atención!</h3>
      <p>Algunos productos no pudieron ser procesados, se encuentran a continuación.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 0 auto;">
        <thead>
          <tr>
            <th style="text-align: center; border-bottom: 2px solid #ddd;">Producto</th>
            <th style="text-align: center; border-bottom: 2px solid #ddd;">Cantidad Solicitada</th>
            <th style="text-align: center; border-bottom: 2px solid #ddd;">Stock disponible</th>
          </tr>
        </thead>
        <tbody>
          ${failedProductRows}
        </tbody>
      </table>
      <p>Los mismos se encuentran en tu nuevo carrito, edita las cantidades, elimínalos, o espera a que tengamos más stock para que se procese la compra correctamente.</p>
    <hr />
    `
    : ""; // Si no hay productos fallidos, no mostramos esta sección

  let body = {
    from: '"So Games - Tienda de Juegos Online" <so@games.com>',
    to: user.email,
    subject: `SoGames - Detalle de tu compra`,
    html: `
          <div>
            <h1 style="text-align: center;">¡Gracias por tu compra, ${
              user.first_name
            }!</h1>
            <p>
              El día de hoy realizaste una compra en SoGames, tienda de juegos de mesa
              online. La misma ha sido exitosa y la estamos procesando. A continuación están los detalles de los productos.
            </p>
    
            <h3>Ticket Number - ${code}</h3>
    
            <table style="width: 100%; border-collapse: collapse; margin: 0 auto;">
              <thead>
                <tr>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Producto</th>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Cantidad</th>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Precio</th>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
    
            <h3>Monto Total: ${formatCurrency(amount)}</h3>
            
            <p>Pronto recibirás otro correo con los detalles del envío.</p>

            ${failedProductsSection}
  
          <div style="display: flex; align-items: center; margin-top: 10px;">
              <h2 style="margin: 0;">El Equipo de SoGames</h2>
              <img src="cid:icono" alt="Logo SoGames" style="max-width: 25px; margin: 1px;" />
            </div>
          </div>
        `,
    attachments: [
      {
        filename: "icono.png",
        path: __dirname + "../../../public/images/icono.png",
        cid: "icono",
      },
    ],
  };

  return body;
}
