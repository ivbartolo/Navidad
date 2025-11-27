# 🎄 Lotería de Navidad - Gestor de Décimos

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Aplicación web para gestionar tus décimos de la Lotería de Navidad con inteligencia artificial integrada.

## ✨ Características

- 📝 **Gestión de Décimos**: Añade, edita y elimina tus números de lotería
- 🔍 **Búsqueda Inteligente**: Busca décimos por el nombre de la persona con quien los compartes
- 📊 **Ordenación Flexible**: Ordena por número (ascendente/descendente) o por fecha de registro
- 📸 **OCR de Imágenes**: Extrae automáticamente el número del décimo desde una foto usando Gemini AI
- 🎁 **Comprobación de Premios**: Verifica automáticamente si tus números han sido premiados usando IA para buscar resultados en la web
- 📄 **Exportación a PDF**: Genera un PDF con todos tus décimos y estadísticas
- 👥 **Gestión de Participantes**: Registra con quién compartes cada décimo
- 📈 **Estadísticas**: Visualiza tu inversión total y premios obtenidos
- 🌓 **Modo Oscuro**: Interfaz adaptable con tema claro y oscuro
- 📱 **Responsive**: Funciona perfectamente en móvil, tablet y escritorio

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **IA**: Google Gemini AI (OCR y búsqueda de premios)
- **Estilos**: CSS personalizado con tema navideño
- **PDF**: jsPDF + html2canvas

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **Cuenta de Supabase** (gratuita): [https://supabase.com](https://supabase.com)
- **API Key de Google Gemini**: [https://ai.google.dev](https://ai.google.dev)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ivbartolo/Navidad.git
cd Navidad
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
GEMINI_API_KEY=tu_api_key_de_gemini
```

**Obtener credenciales de Supabase:**

1. Crea un proyecto en [https://supabase.com](https://supabase.com)
2. Ve a **Settings** → **API**
3. Copia la **URL** y la **anon/public key**

**Obtener API Key de Gemini:**

1. Ve a [https://ai.google.dev](https://ai.google.dev)
2. Haz clic en **Get API Key**
3. Copia tu clave API

### 4. Configurar la base de datos

Sigue las instrucciones detalladas en [SETUP.md](./SETUP.md) para crear las tablas y configurar Supabase correctamente.

**Resumen rápido:**

1. Abre el **SQL Editor** en tu proyecto de Supabase
2. Copia y ejecuta el script SQL del archivo SETUP.md
3. Esto creará las tablas `profiles` y `tickets` con sus políticas de seguridad

### 5. Ejecutar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📖 Guía de Uso

### Registro e Inicio de Sesión

1. Abre la aplicación en tu navegador
2. Crea una cuenta con tu email y contraseña
3. Verifica tu email (si es necesario según la configuración de Supabase)
4. Inicia sesión

### Añadir un Décimo

**Opción 1: Manual**

1. Haz clic en **"Añadir Décimo"**
2. Introduce el número del décimo (5 dígitos)
3. Especifica el número de participantes
4. Introduce la cantidad jugada total
5. Opcionalmente, añade el nombre de las personas con quien lo compartes
6. Guarda

**Opción 2: Con Foto (OCR)**

1. Haz clic en **"Añadir Décimo"**
2. Haz clic en el icono de cámara
3. Toma una foto del décimo o selecciona una de tu galería
4. La IA extraerá automáticamente el número
5. Completa el resto de información
6. Guarda

### Buscar Décimos

- Usa la barra de búsqueda para filtrar por el nombre de la persona con quien compartes el décimo
- La búsqueda es **case-insensitive** y soporta coincidencias parciales

### Ordenar Décimos

Utiliza el selector de ordenación para:

- **Ordenar por fecha**: Muestra los más recientes primero (por defecto)
- **Número (0-9)**: Orden ascendente
- **Número (9-0)**: Orden descendente

### Comprobar Premios

1. Haz clic en **"Comprobar Premios"**
2. La IA buscará en la web los resultados oficiales
3. Automáticamente actualizará los premios de tus décimos
4. Verás una notificación con el número de décimos premiados

### Exportar a PDF

1. Haz clic en **"Exportar a PDF"**
2. Se generará un documento con todos tus décimos, estadísticas e información de participantes
3. El PDF se descargará automáticamente

### Cambiar Vista

- Alterna entre **vista de cuadrícula** y **vista de lista** usando los iconos en la esquina superior derecha

## 🏗️ Desarrollo

### Estructura del Proyecto

```
Navidad/
├── components/
│   ├── auth/           # Componentes de autenticación
│   ├── dashboard/      # Componentes del panel principal
│   ├── icons/          # Iconos personalizados
│   └── ui/             # Componentes UI reutilizables
├── hooks/              # Custom React hooks
├── services/           # Servicios (Gemini AI, PDF)
├── utils/              # Utilidades y helpers
├── types.ts            # Definiciones de TypeScript
├── App.tsx             # Componente principal
└── supabaseClient.ts   # Cliente de Supabase
```

### Construir para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Despliegue

Puedes desplegar esta aplicación en:

- **Vercel**: Importa el repositorio y añade las variables de entorno
- **Netlify**: Similar a Vercel
- **Supabase Hosting**: Usando Supabase CLI

## 🔒 Seguridad

- Las credenciales de Supabase nunca deben estar hardcodeadas
- El archivo `.env` está en `.gitignore` y no se sube al repositorio
- La base de datos usa **Row Level Security (RLS)** para proteger los datos
- Cada usuario solo puede ver y modificar sus propios décimos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🎯 Roadmap

- [ ] Notificaciones push cuando se publiquen resultados
- [ ] Compartir décimos mediante enlace
- [ ] Historial de años anteriores
- [ ] Grupos familiares para gestión colectiva
- [ ] Gamificación con logros y badges
- [ ] Modo offline con sincronización

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un [issue](https://github.com/ivbartolo/Navidad/issues) en GitHub.

---

Hecho con ❤️ para gestionar tus décimos de Navidad
