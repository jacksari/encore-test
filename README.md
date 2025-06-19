# Encore Test

Proyecto de ejemplo usando [Encore](https://encore.dev/) con TypeScript y Prisma, que expone múltiples endpoints para gestionar recibos (receipts).

## 🚀 Requisitos

- Node.js > 20
- [Encore CLI](https://encore.dev/docs/install)

## 🛠️ Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/jacksari/encore-test
cd encore-test
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Instalar Encore CLI (si aún no lo tienes)**

```bash
curl -L https://encore.dev/install.sh | bash
```

> Más información en: https://encore.dev/

4. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Conexión a Supabase (connection pooling)
DATABASE_URL=

# Conexión directa para migraciones
DIRECT_URL=

# URL del backend
URL_BACKEND=http://localhost:4000

# Token de acceso a OpenAI
OPENIA_TOKEN=
```

5. **Ejecutar el proyecto**

```bash
encore run
```

6. **Ejecutar tests**

```bash
npx jest
```

7. **Documentacion Postman**

[Postman](https://documenter.getpostman.com/view/10645967/2sB2x9jqbF)

## 🌐 Endpoints disponibles

Una vez levantado el proyecto:

- Accede al panel de Encore: http://localhost:9400
- Accede al API: http://localhost:4000

### Lista de Endpoints

| Tipo   | Método | Ruta                   | Descripción                               |
| ------ | ------ | ---------------------- | ----------------------------------------- |
| Public | POST   | `/auth/login`          | `generateToken` (obtener token)           |
| Auth   | POST   | `/receipts`            | `createReceipt`                           |
| Auth   | GET    | `/receipts`            | `findAll`                                 |
| Auth   | GET    | `/receipts/export`     | `generateFileCsv`                         |
| Auth   | POST   | `/receipts/ia`         | `analizeData` - Consulta IA sobre recibos |
| Public | GET    | `/uploads/:filename`   | `downloadFile`                            |
| Auth   | PUT    | `/receipts/:id/status` | `updateReceiptStatus`                     |

### Preguntas para el api (analizeData)

- ¿Cuánto es el total de IGV de las facturas validadas?
- Dame el monto total del mes de mayo del 2025
- Dame el monto total de boletas del mes de junio del 2025
- Dame el monto total de boletas validadas del mes de junio del 2025

## 🔐 Autenticación

Antes de utilizar los endpoints protegidos (`Auth`), primero llama al endpoint:

```
POST /auth/login
```

Este generará un token de autenticación. Usa ese token en las siguientes peticiones como `Bearer Token` en el header:

```
Authorization: Bearer <tu_token_aquí>
```

---

Proyecto creado con ❤️ por [@jacksari](https://github.com/jacksari)
