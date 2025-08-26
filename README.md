# FinzoFlow 🚀

**FinzoFlow** es una aplicación web moderna de gestión financiera diseñada para freelancers y pequeñas empresas. Proporciona herramientas completas para gestionar facturas, clientes, gastos y análisis financieros.

## ✨ Características Principales

### 📊 Dashboard Inteligente
- Estadísticas financieras en tiempo real
- Gráficos de ingresos y gastos
- Resumen de facturas pendientes y vencidas
- Análisis de crecimiento mensual

### 📄 Gestión de Facturas
- Creación y edición de facturas profesionales
- Múltiples estados: borrador, enviada, vista, pagada, vencida
- Cálculo automático de impuestos
- Generación de números de factura únicos
- Historial completo de transacciones

### 👥 Gestión de Clientes
- Base de datos completa de clientes
- Información de contacto y empresa
- Historial de facturas por cliente
- Validación de datos duplicados

### 💰 Control de Gastos
- Categorización automática de gastos
- Marcado de gastos deducibles
- Seguimiento de recibos
- Análisis por categorías y períodos

### 🔐 Autenticación Segura
- Sistema de login/registro
- JWT tokens para sesiones
- Encriptación de contraseñas
- Protección de rutas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** para build y desarrollo
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones
- **Axios** para peticiones HTTP

### Backend
- **Node.js** con Express
- **SQLite** como base de datos
- **JWT** para autenticación
- **bcryptjs** para encriptación
- **Express Validator** para validaciones
- **Helmet** para seguridad

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd finzo-mejoras
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
cd ..
```

### 4. Configurar variables de entorno
```bash
cp backend/env.example backend/.env
# Editar backend/.env con tus configuraciones
```

### 5. Inicializar la base de datos
```bash
cd backend
npm run init-db
cd ..
```

### 6. Ejecutar la aplicación

#### Opción A: Ejecutar frontend y backend por separado
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

#### Opción B: Ejecutar todo junto
```bash
npm run dev:full
```

### 7. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔑 Credenciales de Demo

Para probar la aplicación, puedes usar estas credenciales:

- **Email**: `demo@finzoflow.com`
- **Contraseña**: `password123`

## 📁 Estructura del Proyecto

```
finzo-mejoras/
├── src/                    # Código fuente del frontend
│   ├── components/         # Componentes React
│   │   ├── auth/          # Componentes de autenticación
│   │   ├── clients/       # Gestión de clientes
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── expenses/      # Gestión de gastos
│   │   ├── invoices/      # Gestión de facturas
│   │   ├── layout/        # Componentes de layout
│   │   └── ui/           # Componentes de UI
│   ├── context/          # Contexto global de React
│   ├── types/           # Definiciones de tipos TypeScript
│   └── App.tsx          # Componente principal
├── backend/              # Código fuente del backend
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware personalizado
│   ├── config/         # Configuración de la base de datos
│   └── server.js       # Servidor principal
├── public/             # Archivos estáticos
└── package.json        # Dependencias del frontend
```

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Linting del código

### Backend
- `npm run dev:backend` - Servidor de desarrollo del backend
- `npm run init-db` - Inicializar base de datos

### Ambos
- `npm run dev:full` - Ejecutar frontend y backend simultáneamente

## 🛡️ Características de Seguridad

- **Autenticación JWT** con tokens de 7 días
- **Encriptación de contraseñas** con bcrypt
- **Validación de datos** en frontend y backend
- **Rate limiting** para prevenir abuso
- **CORS configurado** para seguridad
- **Helmet** para headers de seguridad
- **Sanitización de inputs** con express-validator

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/change-password` - Cambiar contraseña

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Facturas
- `GET /api/invoices` - Listar facturas
- `POST /api/invoices` - Crear factura
- `PUT /api/invoices/:id` - Actualizar factura
- `PATCH /api/invoices/:id/status` - Cambiar estado
- `DELETE /api/invoices/:id` - Eliminar factura

### Gastos
- `GET /api/expenses` - Listar gastos
- `POST /api/expenses` - Crear gasto
- `PUT /api/expenses/:id` - Actualizar gasto
- `DELETE /api/expenses/:id` - Eliminar gasto
- `GET /api/expenses/stats/summary` - Estadísticas

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/quick-actions` - Acciones rápidas

## 🎨 Características de UI/UX

- **Diseño responsive** para todos los dispositivos
- **Tema moderno** con gradientes y animaciones
- **Navegación intuitiva** con sidebar colapsible
- **Notificaciones en tiempo real** con toast
- **Formularios validados** con feedback visual
- **Carga progresiva** de datos
- **Accesibilidad** mejorada

## 🔮 Próximas Características

- [ ] **Reportes avanzados** con exportación PDF
- [ ] **Configuraciones de usuario** personalizables
- [ ] **Notificaciones por email** para facturas vencidas
- [ ] **Integración con pasarelas de pago**
- [ ] **Sincronización en la nube**
- [ ] **Aplicación móvil** React Native
- [ ] **Múltiples monedas** y conversión automática
- [ ] **Backup automático** de datos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, puedes:

- Abrir un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de la API

---

**FinzoFlow** - Simplificando la gestión financiera para freelancers y pequeñas empresas. 💼✨
