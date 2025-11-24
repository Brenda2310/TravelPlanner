# ✈️ TravelPlanner


Este es el frontend oficial de TravelPlanner, una aplicación web desarrollada en Angular que permite planificar viajes de manera integral. Funciona como cliente del backend en Spring Boot, consumiendo servicios REST para gestionar usuarios, viajes, itinerarios, gastos, actividades y listas personalizadas.
La aplicación está diseñada con una arquitectura modular, escalable y 100% responsive, utilizando Signal-Stores para un manejo de estado simple, eficiente y reactivo.


---

# Key Features

- Gestión de usuarios con autenticación y perfiles individuales.
- Planificación de viajes: destino, fechas, presupuesto y participantes.
- Itinerarios diarios con actividades, horarios y notas.
- Registro de gastos por categoría, monto y fecha.
- Checklists personalizadas para cada viaje.
- Gestión de estado con stores por feature.
- Consumo de API REST del backend (Spring Boot).
- Manejo centralizado de errores, loading y autenticación.
- Rutas protegidas mediante guards.

---

# Estructura del Proyecto
```md
src/
├── app/
│   ├── activities/              # Gestión de Actividades
│   ├── AppLayout/               # Layout principal (header, contenedor, nav)
│   ├── checklist/               # Gestión de Checklists personalizadas
│   ├── companies/               # Gestión de empresas
│   ├── expenses/                # Gestión de gastos + métricas
│   ├── footer/                  # Footer
│   ├── guards/                  # Rutas protegidas (auth, guest)
│   ├── hateoas/                 # Helpers de paginación y navegación HATEOAS
│   ├── header/                  # Header + menú de usuario
│   ├── home/                    # Página de inicio
│   ├── itineraries/             # Gestión de itinerarios
│   ├── not-found/               # Página 404
│   ├── reservations/            # Gestión de Reservas de actividades (flows y UI)
│   ├── security/                # Login, registro, sesión y stores de usuario
│   ├── trips/                   # Gestión de viajes (CRUD + detalle)
│   ├── users/                   # Perfil del usuario
│   ├── app.config.ts            # Configuración global de Angular
│   ├── app.css                  # Estilos globales del app component
│   ├── app.routes.ts            # Rutas principales de la aplicación
│   ├── app.spec.ts              # Tests base del componente raíz
│   ├── app.ts                   # Componente raíz
│   ├── BaseService.ts           # Servicio base para peticiones HTTP
│   └── BaseStore.ts             # Clase base para stores con señales
├── custom-theme.scss            # Tema de Angular Material personalizado
├── index.html                   # HTML principal
├── main.ts                      # Punto de entrada de Angular
└── styles.css                   # Estilos globales y variables CSS
```
# Interfaz y Diseño

El frontend de TravelPlanner sigue una línea visual moderna orientada a la claridad, accesibilidad y experiencia del usuario. Toda la UI está construida con estilos propios más Angular Material y Bootstrap, manteniendo una estética coherente en cada módulo.

Paleta de Colores (TravelPlanner)
- La aplicación utiliza un esquema de colores natural y elegante basado en variables CSS globales:
- Color principal: #07494F — azul verdoso profundo, asociado al viaje, naturaleza y calma.
- Color secundario: #20DF6C — verde vibrante para acciones, estados completados y highlights.
- Fondo principal: #FFFFFA — tono cálido que aporta limpieza y contraste.
- Acentos y sombras suaves para tarjetas, botones y modales.
- Estas variables están definidas en :root para permitir consistencia y fácil mantenimiento.

# Estética del Proyecto

TravelPlanner implementa un diseño limpio con:
- Glassmorphism en formularios, contenedores y tarjetas (fondos translúcidos con blur para mejorar la lectura sobre imágenes).
- Headers transparentes con blur, que mantienen visibilidad del contenido sin perder navegación.
- Tarjetas con bordes redondeados y sombras suaves (box-shadow) para resaltar información.
- Layout responsive basado en Flex y Grid.

# Flujo de Uso en TravelPlanner
```md
1. Registro
   └── El usuario completa el formulario de registro
       └── Se crea su cuenta y queda habilitado para entrar

2. Inicio de Sesión
   └── El usuario ingresa con email y contraseña
       └── Accede a la pantalla "Mis Viajes"

3. Crear un Viaje
   └── Mis Viajes → + Crear nuevo viaje
       ├── Ingresa destino
       ├── Selecciona fechas
       ├── Define presupuesto
       └── Agrega participantes
           └── Se muestra el nuevo viaje en la lista

4. Crear un Itinerario
   └── Sección "Itinerarios"
       └── + Crear itinerario
           ├── Selecciona día/fecha según viaje
           └── Agrega notas del día
               └── El itinerario aparece en la lista

5. Crear una Actividad
   └── Sección "Actividades"
       └── + Crear actividad
           ├── Nombre de la actividad
           ├── Horario
           ├── Precio
           ├── Agrega participantes
           ├── Notas / detalle
               └── La actividad se suma al día (itinerario) correspondiente

6. Reservar una Actividad 
   └── Actividades creadas por empresas (módulo Companies)
       └── El usuario puede seleccionar una actividad publicada por una empresa
           ├── Ve descripción, precio, y detalles
           ├── Hace clic en "Reservar actividad"
           └── Se redirige al flujo de pago con Mercado Pago
               └── Una vez confirmado el pago:
                   ├── La reserva queda asociada al viaje

7. Crear una Checklist
   └── En el viaje: sección "Checklist"
       └── + Nueva lista
           ├── Título de la checklist
           └── Ítems (agregar, marcar, editar)
               └── Se muestra la checklist completa del viaje

8. Registrar Gastos
   └── En el viaje: sección "Gastos"
       └── + Crear gasto
           ├── Categoría
           ├── Monto
           ├── Fecha
           └── Quién participó del gasto
               └── Se actualizan los totales y métricas del viaje
```
# Instalación

Este proyecto requiere el **backend de TravelPlanner** para funcionar correctamente.  
El frontend depende de la API REST del backend para gestionar viajes, itinerarios, actividades, gastos y reservas.

# Tech Stack

- Angular 20
- TypeScript
- RxJS
- Angular Signals / Stores
- HTML + CSS / SCSS
- Angular Material
- REST API integration con HttpClient

# Equipo

- **Melina Di Meglio** 
- **Lucía Castagnino** 
- **Brenda Fernández**

# Licencia
Este proyecto es de código abierto y fue desarrollado como parte de la materia Programación IV de la Universidad Tecnológica Nacional – Facultad Regional Mar del Plata (UTN-FRMDP).
Su finalidad es exclusivamente académica y formativa.
