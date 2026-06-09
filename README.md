# Baloto Data Analytics 📊🟢🔴

Aplicación Full Stack diseñada para el seguimiento, almacenamiento y análisis probabilístico de los resultados de las loterías Baloto y Revancha. Este proyecto marca mi retorno al desarrollo activo, aplicando buenas prácticas de arquitectura de software y separación de responsabilidades.

## 🛠️ Tecnologías Utilizadas

### Backend
* **Node.js** (v22.13.1) & **Express**: Arquitectura REST para la gestión de endpoints y lógica de negocio.

### Frontend
* **React** & **Vite**: Interfaz de usuario dinámica, optimizada y de alto rendimiento.
* **Componentes Modulares**: Renderizado eficiente de estructuras de datos complejas (matrices de sorteos).

---

## 🚀 Arquitectura del Proyecto

El repositorio está estructurado como un monolito dividido en dos capas independientes:

* `/backend`: Servidor API que procesa el histórico de sorteos.
* `/frontend`: Aplicación SPA (Single Page Application) que consume la API y renderiza de forma visual las balotas amarillas y la súper balota roja.

---

## 📦 Instalación y Uso Local

### Prerrequisitos
* Node.js instalado localmente.

### Configuración del Backend
1. Navega a la carpeta del servidor:
```bash
   cd backend