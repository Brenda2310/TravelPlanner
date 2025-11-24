# ✈️ TravelPlanner


Este es el frontend oficial de TravelPlanner, una aplicación web desarrollada en Angular que permite planificar viajes de manera integral. Funciona como cliente del backend en Spring Boot, consumiendo servicios REST para gestionar usuarios, viajes, itinerarios, gastos, actividades y listas personalizadas.
La aplicación está diseñada con una arquitectura modular, escalable y 100% responsive, utilizando Signal-Stores para un manejo de estado simple, eficiente y reactivo.


---

# Key Features

Gestión de usuarios con autenticación y perfiles individuales.

Planificación de viajes: destino, fechas, presupuesto y participantes.

Itinerarios diarios con actividades, horarios y notas.

Registro de gastos por categoría, monto y fecha.

Checklists personalizadas para cada viaje.

Gestión de estado con stores por feature.

Consumo de API REST del backend (Spring Boot).

Manejo centralizado de errores, loading y autenticación.

Rutas protegidas mediante guards.

---

# Estructura del Proyecto
```md
src/app/
  activities/        # Actividades (CRUD)
  AppLayout/         # Layout principal: header, contenedores
  checklist/         # Checklists personalizadas por viaje
  companies/         # Módulo de actividades creadas por empresas
  expenses/          # Gestión de gastos + métricas + stores
  footer/            # Footer general del sitio
  guards/            # Guards de autenticación (auth, guest, role)
  hateoas/           # Modelos y helpers para paginación y enlaces HATEOAS
  header/            # Header + menú de usuario + navegación
  home/              # Pantalla inicial
  itineraries/       # Itinerarios diarios (CRUD)
  reservations/      # Reservas de actividades con validaciones
  security/          # Autenticación, login, register, stores y JWT interceptor
  trips/             # Viajes (CRUD)
  users/             # Gestión de perfil del usuario
...

# Tech Stack
- Angular 20
- TypeScript
- RxJS
- Angular Signals / Stores
- HTML + CSS / SCSS
- Angular Material
- REST API integration con HttpClient
