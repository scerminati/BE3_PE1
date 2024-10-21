//Get Card Id para el proyecto, solamente adquiere el ID del cart, pero se puede obtener todos los datos de sesión del usuario.

const getCartId = async () => {
  try {
    const response = await fetch("../api/sessions/cartLink", {
      method: "GET",
      credentials: "include",
    });

    if (response.status != 200) {
      return null;
    }

    const data = await response.json();

    return data.payload;
  } catch (error) {
    tostada("Error del servidor.")
    console.error("Error de servidor:", error.message);
  }
};

//Función de cantidad total en el carrito para obtener el cart count.
const getQT = async () => {
  const cartId = await getCartId();
  if (cartId) {
    try {
      const response = await fetch(`/api/carts/${cartId}/QT`);
      if (response.status == 200) {
        const data = await response.json();
        cartCount.innerText = data.payload;
      } else {
        cartCount.innerText = 0;
      }
    } catch (error) {
      tostada("Error del servidor.")
      console.error("Error:", error.message);
    }
  } else {
    cartCount.innerText = 0;
  }
};

// Función para actualizar el enlace del carrito
const updateCartLink = async () => {
  const cartId = await getCartId();
  if (cartId) {
    const cartLink = document.getElementById("cartLink");
    cartLink.href = `/carts/${cartId}`;
    await getQT();
  } else {
    cartLink.href = `/login`;
    console.log("Usuario no logueado");
  }
};

//Tostify alerts para todo el proyecto, se carga en main.handlebars.

function tostada(texto) {
  Toastify({
    text: texto,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#cc7f53",
      color: "black",
    },
  }).showToast();
}
