# DORWIN - Landing Page (Tienda Pública)

Este es el sitio web público para los clientes, construido con Next.js 16 y Tailwind CSS.

## Requisitos
- Node.js (v18 o superior).

## Configuración y Arranque (Paso a Paso)

Sigue estos pasos para levantar el sitio web público en tu máquina local:

### Paso 1: Clonar el proyecto
Abre tu terminal, clona el repositorio y entra a la carpeta:
```bash
git clone <url-del-repositorio>
cd landing
```

### Paso 2: Instalar las dependencias
Asegúrate de tener Node.js instalado (v18+) y ejecuta:
```bash
npm install
```

### Paso 3: Configurar Variables de Entorno (.env)
Si el landing necesita conectarse a la API, debes crear un archivo `.env` en la raíz de la carpeta con esta variable:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Paso 4: Iniciar el Servidor de Desarrollo
Levanta la aplicación con Next.js:
```bash
npm run dev
```
La página web estará disponible en `http://localhost:3000`.
