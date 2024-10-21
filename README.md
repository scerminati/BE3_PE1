# Backend III - PreEntrega 1 - Sofía Cerminati

Este proyecto es la programación del Backend del E-Commerce So-Games, para juegos de mesa, junto con la implementación de su FrontEnd. El mismo se realiza como finalización del curso Programación Backend III: Testing y Escalabilidad Backend de CODERHOUSE, comisión 70070, con el profesor Omar Jesús Maniás.

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Servidor](#servidor)
3. [Routers](#routers)
4. [Endpoints](#endpoints)
5. [Arquitectura por Capas](#arquitectura-por-capas)
6. [Mongoose y Modelos](#mongoose-y-modelos)
7. [Multer y subida de archivos](#multer-y-subida-de-archivos)
8. [Utils](#utils)
9. [Sesión, Autenticación y Autorización](#sesión-autenticación-y-autorización)
10. [Visualización y Gestión de E-Commerce en FrontEnd](#visualización-y-gestión-de-e-commerce-en-frontend)
11. [Estructura del Proyecto](#estructura-del-proyecto)
12. [Recursos Utilizados](#recursos-utilizados)

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/scerminati/BE3_PE1_Cerminati.git
```

2. Navegar al directorio del repositorio

```bash
cd BE3_PE1_Cerminati
```

3. Instalar las dependencias

```bash
npm install
```

4. Iniciar la aplicación

```bash
npm start
```

5. Configurar las variables de entorno. Se puede verificar lo necesario en el archivo `.env.example` y copiar el mismo en la raiz del proyecto como `src/.env`.

## Servidor

El servidor está configurado para ejecutarse en _localhost_ en el puerto configurado en la variable de entonrno `PORT`. Una vez que la aplicación esté inicializada con el comando `npm start`, se puede visualizar el proyecto en un navegador con el siguiente link:

- **http://localhost:`PORT`/**

## Routers

La aplicación cuenta con seis routers:

- **Products**: Contiene los métodos **GET**, **POST**, **PUT** y **DELETE** para la gestión de productos.
- **Carts**: Incluye los métodos **GET**, **POST**, **PUT** y **DELETE** para la gestión de carritos.
- **Users**: Permite la gestión de usuarios, utilizando los métodos **GET** y **PUT**.
- **Tickets**: Permite la gestión de pedidos, utilizando los métodos **GET** y **PUT**.
- **Sessions**: Permite el registro, inicio de sesión y autentificación del usuario dentro del sitio. Incluye los métodos **GET** y **POST**.
- **Views**: Permite renderizar la información en pantalla usando Handlebars mediante el método **GET**.

## Endpoints

A continuación se describen todos los endpoints disponibles en el backend, con las respuestas correspondientes

### Carts `/api/carts/`

- **GET**: Este endpoint permite recuperar información sobre los carritos. La ruta **/api/carts/** está disponible únicamente para usuarios autenticados con privilegios de administrador y se utiliza para obtener una lista completa de todos los carritos a través del controlador `getAllCartsController`.

  - **/api/carts/:cid**: Permite obtener los detalles de un carrito específico utilizando su identificador único **cid**. Este endpoint está restringido a usuarios autenticados que son propietarios del carrito, gestionando la solicitud a través del controlador `getCartController`.

  - **/api/carts/:cid/QT**: Este endpoint permite obtener la cantidad total de productos en un carrito específico. La ruta está habilitada para la navegación y se maneja a través del controlador `getCartQTController`.

- **POST**: Este endpoint permite crear un nuevo carrito en la ruta **/api/carts/**. Solo está disponible para usuarios autenticados con privilegios de administrador, y se invoca el controlador `createCartController` para generar un nuevo carrito con un identificador asignado automáticamente y un array de productos vacío.

- **POST**: **/api/carts/:cid/checkout**: Este endpoint permite procesar la compra del carrito especificado. Requiere autenticación y ejecuta el controlador `checkoutCartController`.

- **PUT**: Este endpoint permite editar el contenido de un carrito existente. La ruta **/api/carts/:cid/product/:pid** requiere que el usuario esté autenticado y que tenga acceso al carrito, invocando el controlador `editProductInCartController` para agregar un producto específico **pid** al carrito **cid**.

- **DELETE**: Este endpoint permite eliminar productos de un carrito o vaciar el carrito completo.

  - **/api/carts/:cid**: Elimina todos los productos del carrito especificado, manteniendo el carrito vacío para futuras compras. Este endpoint requiere autenticación y verifica que el usuario sea propietario del carrito a través del controlador `emptyCartController`.

  - **/api/carts/:cid/product/:pid**: Elimina un producto específico del carrito. Requiere autenticación y acceso al carrito, gestionando la solicitud con el controlador `deleteProductInCartController`.

### Products `/api/products/`

- **GET**: Este endpoint permite recuperar información sobre los productos.

  - **/api/products/**: Devuelve una lista completa de todos los productos disponibles. Este endpoint utiliza el controlador `getAllProductsController` y requiere que el usuario esté autenticado para navegar por la lista.

  - **/api/products/:pid**: Permite obtener los detalles de un producto específico utilizando su identificador único **pid**. Esta ruta también está disponible para la navegación y es gestionada por el controlador `getProductController`.

- **POST**: Este endpoint permite crear un nuevo producto en la ruta **/api/products/**. Solo está disponible para usuarios autenticados con privilegios de administrador. Utiliza el controlador `createProductController` y requiere la carga de una imagen a través del middleware `uploader`, que maneja la subida de archivos utilizando `multer`. Si se produce un error durante la carga, se invoca el manejador de errores `multerErrorHandler`.

- **PUT**: Este endpoint permite editar un producto existente. La ruta **/api/products/:pid** está restringida a usuarios autenticados con privilegios de administrador. Utiliza el controlador `editProductController` y también requiere la carga de una imagen. El proceso de subida y manejo de errores es el mismo que en el método POST.

- **DELETE**: Este endpoint permite eliminar un producto específico utilizando su identificador único **pid**. La ruta **/api/products/:pid** requiere autenticación y privilegios de administrador. La eliminación del producto se maneja a través del controlador `deleteProductController`.

### Users `/api/users`

- **GET**: Este endpoint permite obtener la lista completa de usuarios. La ruta **/api/users** solo está disponible para usuarios autenticados y con privilegios de administrador. Al acceder a esta ruta, se invoca el controlador `getAllUsersController`, que devuelve todos los usuarios registrados en el sistema.

- **PUT**: Este endpoint ofrece dos opciones para gestionar los roles de los usuarios:
  - **/api/users/:uid/makeAdmin**: Al invocar esta ruta, un administrador puede promover a un usuario (especificado por su **uid**) a administrador. Este cambio es gestionado por el controlador `makeAdminController`.
  - **/api/users/:uid/makeUser**: Similarmente, esta ruta permite a un administrador revertir el rol de un usuario (especificado por su **uid**) a usuario normal. Esta acción es manejada por el controlador `makeUserController`.

### Tickets `/api/tickets`

- **GET**: Este endpoint permite acceder a la información de los tickets. La ruta **/api/tickets** está disponible solo para usuarios autenticados con privilegios de administrador, invocando el controlador `getAllTicketsController` para obtener la lista completa de tickets registrados.

  - **/api/tickets/:tid**: Permite obtener un ticket específico utilizando su identificador único **tid**. Este endpoint está disponible para usuarios autenticados, gestionando la solicitud a través del controlador `getTicketController`.

  - **/api/tickets/:tid/user/:uid**: Este endpoint permite obtener todos los tickets asociados a un usuario específico, indicado por su **uid**, a partir de un ticket particular **tid**. Esta función también está disponible para usuarios autenticados y es manejada por el controlador `getTicketsFromUserController`.

- **PUT**: Este endpoint permite editar un ticket existente. La ruta **/api/tickets/:tid** requiere que el usuario esté autenticado y tenga privilegios de administrador, invocando el controlador `editTicketController` para realizar las modificaciones necesarias en el ticket especificado.

### Sessions `/api/sessions/`

- **GET**: Este endpoint permite obtener información sobre el usuario que ha iniciado sesión.

  - **/api/sessions/current**: Devuelve los detalles del usuario actualmente autenticado. Este endpoint requiere que el usuario esté autenticado y es manejado por el controlador `getLoggedUserController`.

- **GET**: Este endpoint se utiliza para actualizar el enlace del carrito del usuario.

  - **/api/sessions/cartLink**: Permite al usuario obtener y actualizar el enlace de su carrito. Este endpoint utiliza el middleware `navigate` y es gestionado por el controlador `cartLinkUpdateController`.

- **POST**: Este endpoint permite registrar un nuevo usuario.

  - **/api/sessions/register**: Permite a los usuarios crear una nueva cuenta. Este endpoint requiere que el usuario no esté autenticado y es gestionado por el controlador `registerUserController`.

- **POST**: Este endpoint permite a los usuarios iniciar sesión en su cuenta.

  - **/api/sessions/login**: Permite a los usuarios autenticarse. Este endpoint también requiere que el usuario no esté autenticado y es gestionado por el controlador `loginUserController`.

- **POST**: Este endpoint permite a los usuarios cerrar sesión.

  - **/api/sessions/logout**: Permite a los usuarios cerrar sesión de su cuenta. Este endpoint requiere que el usuario esté autenticado y es gestionado por el controlador `logoutUserController`.

### Views `/`

- **GET**: Este endpoint carga la vista principal del sitio.

  - **/**: Proporciona la vista paginada de los productos y se gestiona mediante el controlador `viewsPaginateController`. Este endpoint utiliza el middleware `navigate`.

- **GET**: Este endpoint muestra los detalles de un producto específico.

  - **/products/:pid**: Muestra la información de un producto en particular, utilizando el controlador `viewsProductController`. También utiliza el middleware `navigate`.

- **GET**: Este endpoint carga la vista del carrito de un usuario.

  - **/carts/:cid**: Permite a los usuarios autenticados ver su carrito específico. Este endpoint es gestionado por el controlador `viewsCartController` y requiere que el usuario esté autenticado y que el carrito pertenezca a ese usuario.

- **GET**: Este endpoint muestra los detalles de un ticket.

  - **/tickets/:tid**: Proporciona información sobre un ticket específico. Este endpoint es gestionado por el controlador `viewsTicketController` y requiere que el usuario esté autenticado.

- **GET**: Este endpoint muestra la vista de productos en tiempo real.

  - **/realtimeproducts**: Permite a los administradores autenticados ver los productos en tiempo real, utilizando el controlador `viewsRTPController`.

- **GET**: Este endpoint muestra la vista de usuarios en tiempo real.

  - **/realtimeusers**: Permite a los administradores autenticados ver la lista de usuarios en tiempo real, gestionado por el controlador `viewsRTUController`.

- **GET**: Este endpoint muestra la vista de tickets en tiempo real.

  - **/realtimetickets**: Permite a los administradores autenticados ver los tickets en tiempo real, utilizando el controlador `viewsRTTController`.

- **GET**: Este endpoint carga la vista de inicio de sesión.

  - **/login**: Proporciona la vista de inicio de sesión para usuarios no autenticados, gestionado por el controlador `viewsLoginController`.

- **GET**: Este endpoint carga la vista de registro.

  - **/register**: Proporciona la vista de registro para usuarios no autenticados, gestionado por el controlador `viewsRegisterController`.

- **GET**: Este endpoint carga la vista del perfil del usuario.

  - **/profile**: Permite a los usuarios autenticados ver su perfil, utilizando el controlador `viewsProfileController`.

## Arquitectura por Capas

La arquitectura por capas en este proyecto está diseñada para promover una separación clara de responsabilidades, facilitando el mantenimiento y la escalabilidad de la aplicación. Se estructura en varias capas, cada una con un propósito específico:

1. **Controladores**: Los controladores son responsables de manejar las solicitudes HTTP entrantes y definir la lógica de respuesta. Cada controlador está asociado a un modelo específico y utiliza los servicios para realizar operaciones relacionadas con ese modelo. Por ejemplo, los controladores de `Product`, `Cart`, `Ticket`, y `User` manejan las operaciones de creación, actualización, eliminación y obtención de datos, delegando la lógica de negocio a los servicios correspondientes.

2. **Servicios**: La capa de servicios actúa como intermediaria entre los controladores y los repositorios. Los servicios contienen la lógica de negocio y se encargan de la manipulación de los datos. Utilizan el patrón Factory para crear instancias de los modelos necesarios y llaman a los repositorios para realizar operaciones CRUD en la base de datos. Esta capa permite que la lógica de negocio esté desacoplada de la lógica de presentación, lo que facilita las pruebas y el mantenimiento. Adicionalmente utilizan DTO para filtar la información que se devuelve al controlador.

3. **Repositorios**: La capa de repositorios se encarga de interactuar directamente con la base de datos. Cada repositorio define métodos específicos para las operaciones de acceso a datos, como encontrar, guardar, actualizar y eliminar registros. Utilizando Mongoose, los repositorios abstraen los detalles de la implementación de la base de datos, proporcionando una interfaz clara y coherente para los servicios.

4. **Factory**: El patrón Factory se utiliza para la creación de instancias de los modelos dentro de los servicios. Este enfoque permite gestionar la complejidad y promueve la reutilización de código, asegurando que las instancias de los modelos se creen de manera consistente y controlada.

Esta arquitectura por capas no solo mejora la organización del código, sino que también facilita la implementación de pruebas unitarias y de integración. Al mantener una separación de preocupaciones, se logra un desarrollo más limpio y modular, permitiendo realizar cambios en una capa sin afectar a las demás.

## Mongoose y Modelos

El DAO para las operaciones de Mongoose se define por separado para cada uno de los modelos, de manera que las distintas operaciones estén organizadas y sean fáciles de gestionar. Además, se estandarizan los nombres de las operaciones para facilitar los llamados desde el repositorio.

### Modelos de Datos

- **Product**: Define la estructura de los productos, que incluye campos como título, código, descripción, stock, categoría y thumbnail.
- **Cart**: Define la estructura de los carritos de compra, que incluye un array de productos y su cantidad. Este array de productos se pobla a partir del modelo de _products_.
- **Ticket**: Define la estructura de los pedidos, que almacena una lista de productos adquiridos y asigna el pedido a un usuario específico. Incluye detalles como el código del ticket, fecha de compra, estado (por defecto `pending`) y monto total.
- **User**: Define la estructura de los usuarios para el registro, asignando un rol por defecto de `user` y asociando un carrito.

### Conexión con MongoDB

La conexión a MongoDB se establece usando Mongoose en el archivo `app.js`, asegurando que la base de datos esté disponible para operaciones CRUD. La base de datos utilizada se llama _SoGames_. Adicionalmente, se debe configurar la variable de entorno `PERSISTENCE` como `MONGO` para que el backend maneje la misma.

### Paginado

Se utiliza Mongoose Paginate para realizar el paginado en el índice a partir del modelo de _products_. Esta funcionalidad permite ordenar los productos de forma ascendente o descendente por precio, filtrar por categoría y limitar la cantidad de productos por página.

## Middlewares

### Manejo de Errores

Permite el manejo de errores desde los controlladores, enviando el mensaje de error como .json o renderizando en el frontend la vista de Error. Adicionalmente se utiliza la definición de los errores personalizados de manera de que quede de forma más organizada.

### Sesión, Autenticación y Autorización

Se utiliza `express-session` para mantener la sesión en MongoStore. Adicionalmente se utiliza `passport` y `JsonWebToken` como estrategia de autenticación y autorización a lo largo de la navegación del sitio, teniendo como objetivo principal no autorizar ciertos accesos y proteger la sesión del usuario así como también sus datos sensibles. Se utiliza `cookie-parser` para poder extraer los tokens generados en los inicios de sesión, y permite la navegación durante una hora sin cerrar la sesión de manera automática.

### Multer y subida de archivos

Multer se utiliza para manejar la subida de archivos en `realtimeproducts`. La configuración incluye la definición de almacenamiento y la validación del tipo de archivo permitido, en este caso, imagen. Adicionalmente permite visualizar el contenido antes de subir, y una vez almacenado, lo deja en la carpeta `/public/images`.

## Utils

El archivo `utils.js` contiene una serie de scripts y helpers diseñados para facilitar tareas comunes y operaciones en la aplicación. A continuación, se describen sus principales funcionalidades:

1. **Simulación de \_\_dirname en Módulos ES**:  
   Dado que los módulos ES no soportan nativamente el valor `__dirname`, se ha implementado una solución que permite obtener el directorio actual del archivo. Esto es esencial para manejar rutas de forma consistente dentro del proyecto.

2. **Configuración de Multer para la Subida de Archivos**:  
   Se ha configurado `multer` para manejar la carga de archivos, especificando la carpeta de destino y validando que solo se permitan imágenes como tipo de archivo. Esto asegura que todos los archivos subidos cumplan con los requisitos de la aplicación.

3. **Helper para Errores**:
   Se clasifican los errores con mensajes, status y nombres de manera de manejar los errores del BackEnd de forma más organizada.

4. **Helpers para Handlebars**:  
   Se incluyen helpers personalizados para Handlebars, que permiten realizar comparaciones y operaciones aritméticas básicas dentro de las plantillas.

5. **Helpers para Sockets**
   Se incluyen las emiciones del servidor de manera estandarizada para hacer más fácil las actualizaciones de los distintos datos en el backend.

6. **Json Web Token**
   Genera el token de sesión para expirar dentro de la hora.

7. **Helper para Creación de Correo**
   Contiene el body y la configuración del mismo para luego mandar el correo de confirmación de la compra, permite manejar el cuerpo del correo fuera de la lógica del servicio.

## Visualización y Gestión de E-Commerce en FrontEnd

La visualización del frontend se realiza mediante plantillas de handlebars las cuales se renderizan a pedidos del backend.

### Templates de Handlebars

Los templates de las vistas están organizados por carpetas de manera de acceder fácilmente a cada uno de ellos.

1. **Index**

   - **index**: Permite acceder al listado completo de productos. Adicionalmente, al ingresar por primera vez, se genera un _idCart_ el cual se almacena en el local storage. Dicho valor permitirá la persistencia durante la visita del usuario.

2. **Error**

   - **error**: Renderiza los errores enviados desde el backend.

3. **Administración**

   - **realtimeproducts**: La aplicación cuenta con una funcionalidad en tiempo real que permite la visualización y gestión dinámica de productos desde una vista de administrador. Esta funcionalidad se implementa utilizando **Socket.io** para permitir la comunicación en tiempo real entre el servidor y el cliente, permitiendo eliminar, modificar y añadir productos en la base de datos.
   - **realtimeusers**: Proporciona una vista en tiempo real de los usuarios activos en la aplicación. Permite a los administradores gestionar usuarios, incluyendo la opción de modificar los roles de los mismos en tiempo real.
   - **realtimetickets**: Permite la visualización y gestión de tickets en tiempo real. Los administradores pueden ver los detalles de cada ticket, permitiendo modificar el estado del mismo según corresponda.

4. **Productos**

   - **productDetail**: Visualización de los detalles del producto seleccionado. Permite también añadir al carrito. Si el producto ya se encuentra en el carrito, no permitirá modificar la cantidad. La misma se debe hacer desde la visualización del carrito.

5. **Usuarios**
   - **cart**: Permite la visualización del carrito actual, dejando que el usuario pueda modificar cantidades y/o eliminar productos. Adicionalmente permite realizar un checkout, el mismo eliminará el _idCart_ del local storage, y abrirá uno nuevo cuando se ingrese nuevamente a la página. Este carrito queda almacenado en la base de datos, y no se podrá modificar las cantidades ni los productos desde la sesión nueva.
   - **login**: Permite el inicio de sesión del usuario.
   - **profile**: Visualización de los datos básicos del usuario.
   - **register**: Habilita el registro de un usuario nuevo.
   - **ticket**: Permite la visualización de pedidos anteriores, renderizando productos comprados y estado actual de la compra.

## Estructura del Proyecto

```bash
ProyectoFinal
├─ src
│  ├─ config
│  │  ├─ mail.config.js
│  │  ├─ passport.config.js
│  │  └─ persistence.config.js
│  ├─ controllers
│  │  ├─ carts.controllers.js
│  │  ├─ products.controllers.js
│  │  ├─ sessions.controller.js
│  │  ├─ tickets.controller.js
│  │  ├─ users.controllers.js
│  │  └─ views.controllers.js
│  ├─ DAO
│  │  ├─ DTO
│  │  │  └─ user.DTO.js
│  │  ├─ Mongo
│  │  │  ├─ DAO
│  │  │  │  ├─ CartsMongoDAO.js
│  │  │  │  ├─ ProductsMongoDAO.js
│  │  │  │  ├─ SessionsMongoDAO.js
│  │  │  │  ├─ TicketsMongoDAO.js
│  │  │  │  └─ UsersMongoDAO.js
│  │  │  └─ models
│  │  │     ├─ carts.model.js
│  │  │     ├─ products.model.js
│  │  │     ├─ ticket.model.js
│  │  │     └─ user.model.js
│  │  ├─ repositories
│  │  │  ├─ cartsRepository.js
│  │  │  ├─ productsRepository.js
│  │  │  ├─ sessionsRepository.js
│  │  │  ├─ ticketRepository.js
│  │  │  └─ usersRepository.js
│  │  └─ DAOFactory.js
│  ├─ middleware
│  │  ├─ auth.js
│  │  └─ errorHandler.js
│  ├─ public
│  │  ├─ images
│  │  ├─ js
│  │  └─ styles
│  ├─ router
│  │  ├─ cart.router.js
│  │  ├─ products.router.js
│  │  ├─ session.router.js
│  │  ├─ tickets.router.js
│  │  ├─ users.router.js
│  │  └─ views.router.js
│  ├─ services
│  │  ├─ cart.services.js
│  │  ├─ products.services.js
│  │  ├─ session.service.js
│  │  ├─ sessions.services.js
│  │  ├─ tickets.services.js
│  │  └─ users.services.js
│  ├─ utils
│  │  ├─ database
│  │  │  └─ multerUtils.js
│  │  ├─ main
│  │  │  ├─ dirnameUtils.js
│  │  │  ├─ errorUtils.js
│  │  │  ├─ handlebarsHelpers.js
│  │  │  └─ socketUtils.js
│  │  └─ session
│  │     ├─ mailUtils copy.js
│  │     ├─ mailUtils.js
│  │     └─ webTokenUtil.js
│  ├─ views
│  │  ├─ admin
│  │  │  ├─ realtimeproducts.hbs
│  │  │  ├─ realtimetickets copy.hbs
│  │  │  ├─ realtimetickets.hbs
│  │  │  └─ realtimeusers.hbs
│  │  ├─ error
│  │  │  └─ error.hbs
│  │  ├─ layouts
│  │  │  └─ main.handlebars
│  │  ├─ products
│  │  │  └─ productDetail.hbs
│  │  ├─ users
│  │  │  ├─ cart.hbs
│  │  │  ├─ login.hbs
│  │  │  ├─ profile.hbs
│  │  │  ├─ register.hbs
│  │  │  └─ ticket.hbs
│  │  └─ index.hbs
│  └─ app.js
├─ package-lock.json
├─ package.json
└─ README.md




```

### Descripción de Carpetas y Archivos

- **`src/config/`**: Archivos de configuración de la aplicación, incluyendo configuración de correo, autenticación y persistencia.
- **`src/controllers/`**: Controladores que manejan la lógica de negocio y las interacciones con el modelo de datos para carritos, productos, sesiones, tickets, usuarios y vistas.
- **`src/DAO/`**: Contiene la lógica de acceso a datos, incluyendo patrones DTO y DAO para interactuar con MongoDB.
- **`src/middleware/`**: Middleware personalizado para manejar la autenticación y errores en la aplicación.
- **`src/public/`**: Archivos estáticos, incluyendo imágenes, scripts y estilos que se sirven al cliente.
- **`src/router/`**: Definición de rutas para la API y las vistas del frontend.
- **`src/services/`**: Servicios que encapsulan la lógica de negocio relacionada con carritos, productos, sesiones, tickets y usuarios.
- **`src/utils/`**: Scripts utilitarios y helpers, incluyendo utilidades para el manejo de archivos, errores y WebSockets.
- **`src/views/`**: Plantillas Handlebars para renderizar la interfaz de usuario en el frontend.
- **`src/app.js`**: Archivo principal que inicializa el servidor y configura la aplicación.
- **`.gitignore`**: Especifica los archivos y carpetas que deben ser ignorados por Git.
- **`package.json`**: Contiene la configuración del proyecto, incluyendo dependencias y scripts.
- **`README.md`**: Documentación del proyecto que proporciona información general y de uso.

## Recursos Utilizados

Este proyecto utiliza las siguientes tecnologías y bibliotecas:

- **[Express](https://expressjs.com/)**: Un marco web para Node.js, utilizado para construir el backend.
  - Versión: `^4.19.2`
- **[Express Handlebars](https://handlebarsjs.com/)**: Motor de plantillas para generar vistas HTML dinámicas.
  - Versión: `^7.1.3`
- **[Multer](https://www.npmjs.com/package/multer)**: Middleware para manejar `multipart/form-data`, utilizado para la carga de archivos.
  - Versión: `^1.4.5-lts.1`
- **[Socket.io](https://socket.io/)**: Biblioteca para la comunicación en tiempo real entre el servidor y el cliente.
  - Versión: `^4.7.5`
- **[Mongoose](https://mongoosejs.com/)**: Biblioteca para la modelación de datos en MongoDB y la interacción con la base de datos.
  - Versión: `^8.5.1`
- **[Mongoose Paginate v2](https://www.npmjs.com/package/mongoose-paginate-v2)**: Plugin de Mongoose para agregar paginación a los esquemas de MongoDB.
  - Versión: `^1.8.3`
- **[Toastify](https://apvarun.github.io/toastify-js/)**: Biblioteca para mostrar notificaciones de estilo "toast".
  - Versión: `^1.12.0`
- **[Boxicons](https://boxicons.com/)**: Biblioteca de iconos para mejorar la interfaz de usuario.
  - Versión: `^2.1.2`
- **[Passport](http://www.passportjs.org/)**: Middleware de autenticación para Node.js.
  - Versión: `^0.7.0`
- **[Passport JWT](https://www.npmjs.com/package/passport-jwt)**: Estrategia de Passport para autenticación con JSON Web Tokens (JWT).
  - Versión: `^4.0.1`
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: Biblioteca para el hash y la verificación de contraseñas.
  - Versión: `^5.1.1`
- **[Connect-Mongo](https://www.npmjs.com/package/connect-mongo)**: Adaptador para almacenar sesiones en MongoDB.
  - Versión: `^5.1.0`
- **[Cookie-Parser](https://www.npmjs.com/package/cookie-parser)**: Middleware para analizar cookies en las solicitudes HTTP.
  - Versión: `^1.4.6`
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Carga variables de entorno desde un archivo `.env`.
  - Versión: `^16.4.5`
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: Biblioteca para trabajar con JSON Web Tokens (JWT).
  - Versión: `^9.0.2`
- **[Nodemailer](https://nodemailer.com/)**: Biblioteca para enviar correos electrónicos desde Node.js.
  - Versión: `^6.9.15`
