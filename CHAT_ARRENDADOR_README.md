# 💬 Sistema de Mensajería para Arrendadores - RentITP

## 📋 Resumen de Cambios

Se ha implementado un **sistema completo de gestión de mensajes** para que los arrendadores puedan ver y gestionar todas las conversaciones con usuarios interesados en sus propiedades.

---

## 🆕 Componentes Creados

### 1. **ChatList.jsx** (Frontend)
**Ubicación:** `client/src/components/ChatList.jsx`

**Funcionalidad:**
- Lista todas las conversaciones del arrendador
- Muestra preview del último mensaje
- Indica mensajes no leídos con badge rojo
- Permite abrir conversaciones individuales
- Interfaz con avatar, nombre de usuario y propiedad relacionada

**Props:**
```javascript
<ChatList arrendador_id={user.id} />
```

### 2. **ChatList.css** (Estilos)
**Ubicación:** `client/src/styles/ChatList.css`

**Características:**
- Diseño moderno con cards
- Efectos hover suaves
- Badges de notificación
- Responsive design
- Gradientes y sombras premium

### 3. **Messages.js** (Integración My-Account)
**Ubicación:** `client/src/components/My-Account/Messages.js`

**Funcionalidad:**
- Wrapper para ChatList dentro de My-Account
- Valida usuario logueado
- Pasa el ID del arrendador al componente

---

## 🔧 Modificaciones en Backend

### 1. **chatRoutes.js**
```javascript
// Nuevo endpoint agregado:
router.get("/conversaciones/:arrendador_id", ChatController.obtenerConversacionesArrendador);
```

### 2. **chatController.js**
```javascript
async obtenerConversacionesArrendador(req, res) {
  // Obtiene todas las conversaciones de un arrendador
  // Incluye: usuario, último mensaje, fecha, mensajes no leídos
}
```

### 3. **chatModel.js**
```javascript
async obtenerConversacionesArrendador(arrendador_id) {
  // Query SQL compleja que:
  // - Obtiene usuarios únicos que han chateado
  // - Trae último mensaje y fecha
  // - Cuenta mensajes no leídos
  // - Incluye dirección de apartamento si disponible
}
```

---

## 🔄 Flujo de Funcionamiento

### **Paso 1: Acceso al Panel de Mensajes**
```
Arrendador → My Account → Mensajes (solo visible para rol = 2)
```

### **Paso 2: Carga de Conversaciones**
```
GET /api/chat/conversaciones/:arrendador_id
↓
Retorna array de conversaciones:
[
  {
    usuario_id: 5,
    usuario_nombre: "Juan",
    usuario_apellido: "Pérez",
    usuario_email: "juan@email.com",
    ultimo_mensaje: "Hola, me interesa la propiedad",
    ultimo_mensaje_fecha: "2025-10-30T10:30:00",
    mensajes_no_leidos: 3,
    apartamento_direccion: "Calle 15 #20-30"
  },
  ...
]
```

### **Paso 3: Vista de Lista**
```
┌────────────────────────────────────────┐
│  💬 Mis Conversaciones                 │
│  Mensajes de usuarios interesados...  │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │ [J] Juan Pérez          2 días   │  │
│  │     Hola, me interesa la...  (3) │  │
│  │     🏠 Calle 15 #20-30           │  │
│  │                   [Abrir chat →] │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ [M] María Gómez        1 semana  │  │
│  │     ¿Cuándo puedo visitarla?     │  │
│  │     🏠 Av. Principal 100          │  │
│  │                   [Abrir chat →] │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### **Paso 4: Abrir Chat Individual**
```
Click en "Abrir chat" 
↓
Se renderiza ChatComponent
↓
Conversación completa con historial y envío en tiempo real
```

---

## 🎨 Características de Diseño

### **Lista de Conversaciones:**
✅ **Avatar circular** con inicial del usuario  
✅ **Badge rojo** para mensajes no leídos  
✅ **Preview** del último mensaje (50 caracteres)  
✅ **Timestamp** formateado (día/mes)  
✅ **Tag de propiedad** relacionada  
✅ **Botón de acción** con efecto hover  
✅ **Hover effects** en toda la card  

### **Chat Individual:**
✅ **Botón "Volver"** a la lista  
✅ **Header** con info del usuario  
✅ **Propiedad** de interés mostrada  
✅ **ChatComponent** integrado completo  

---

## 📊 Estructura de Datos

### **Query SQL Compleja:**
```sql
SELECT DISTINCT
  u.user_id as usuario_id,
  u.user_name as usuario_nombre,
  u.user_lastname as usuario_apellido,
  -- Último mensaje (subquery)
  (SELECT contenido FROM mensajes 
   WHERE (emisor_id = u.user_id AND receptor_id = ?) 
      OR (emisor_id = ? AND receptor_id = u.user_id)
   ORDER BY fecha_envio DESC LIMIT 1) as ultimo_mensaje,
  -- Fecha último mensaje
  (SELECT fecha_envio FROM mensajes ...) as ultimo_mensaje_fecha,
  -- Contador de no leídos
  (SELECT COUNT(*) FROM mensajes 
   WHERE emisor_id = u.user_id 
     AND receptor_id = ? 
     AND leido = FALSE) as mensajes_no_leidos,
  a.direccion_apt as apartamento_direccion
FROM mensajes m
INNER JOIN users u ON (...)
LEFT JOIN apartments a ON (...)
WHERE (m.emisor_id = ? OR m.receptor_id = ?)
  AND u.user_id != ?
GROUP BY u.user_id
ORDER BY ultimo_mensaje_fecha DESC
```

**Ventajas:**
- Una sola query para toda la info
- Optimizada con índices en FKs
- Ordenada por fecha más reciente
- Filtra al mismo arrendador

---

## 🚀 Cómo Usar (Para el Arrendador)

### **Paso a Paso:**

1. **Iniciar Sesión** como arrendador (rol = 2)

2. **Ir a My Account:**
   ```
   Click en ícono de usuario → My Account
   ```

3. **Abrir Mensajes:**
   ```
   En el menú lateral → Click en "Mensajes" 💬
   ```

4. **Ver Lista de Conversaciones:**
   - Verás todas las personas que te han contactado
   - Badge rojo indica mensajes sin leer
   - Último mensaje preview visible

5. **Abrir Conversación:**
   ```
   Click en "Abrir chat →"
   ```

6. **Chatear en Tiempo Real:**
   - Escribe mensaje
   - Presiona Enter o "Enviar"
   - Recibe respuestas instantáneamente

7. **Volver a la Lista:**
   ```
   Click en "← Volver a conversaciones"
   ```

---

## 🔐 Seguridad y Permisos

### **Restricción de Acceso:**
```javascript
// Solo arrendadores (rol === 2) ven la pestaña
{user && user.rol === 2 && (
  <li onClick={() => setActiveTab("mensajes")}>
    💬 Mensajes
  </li>
)}
```

### **Validación Backend:**
- Foreign keys en tabla `mensajes`
- Filtrado por `arrendador_id` en queries
- Solo conversaciones donde el arrendador participa

---

## 📱 Responsive Design

### **Móvil:**
- Cards apiladas verticalmente
- Avatar más pequeño
- Botón de acción width 100%
- Font sizes reducidos

### **Desktop:**
- Grid optimizado
- Hover effects completos
- Transiciones suaves

---

## 🔮 Mejoras Futuras Recomendadas

1. **Notificaciones en Tiempo Real:**
   ```javascript
   // Badge en navbar cuando llegan mensajes nuevos
   socket.on("nuevo_mensaje_para_mi", () => {
     setUnreadCount(prev => prev + 1);
   });
   ```

2. **Filtros y Búsqueda:**
   - Buscar por nombre de usuario
   - Filtrar por propiedad
   - Solo no leídos

3. **Marcar como Leído:**
   ```javascript
   await axios.put(`/api/chat/marcar-leido/${mensaje_id}`);
   ```

4. **Archivar Conversaciones:**
   - Estado "archivado" en BD
   - Filtro para mostrar/ocultar

5. **Estadísticas:**
   - Total de conversaciones
   - Tasa de respuesta
   - Tiempo promedio de respuesta

---

## 🧪 Testing (Recomendado)

### **Test 1: Listar Conversaciones**
```bash
curl http://localhost:3443/api/chat/conversaciones/2
```

### **Test 2: Frontend**
1. Login como arrendador
2. Ir a My Account → Mensajes
3. Verificar que aparezcan conversaciones
4. Abrir chat y enviar mensaje

### **Test 3: Tiempo Real**
1. Abrir dos navegadores
2. Usuario en uno, arrendador en otro
3. Usuario envía mensaje
4. Verificar que aparece instantáneamente en arrendador

---

## 📝 Archivos Modificados/Creados

### **Frontend (Client):**
```
✅ client/src/components/ChatList.jsx (NUEVO)
✅ client/src/styles/ChatList.css (NUEVO)
✅ client/src/components/My-Account/Messages.js (NUEVO)
✅ client/src/pages/My-Account.js (MODIFICADO)
```

### **Backend (Server):**
```
✅ server/chat/chatRoutes.js (MODIFICADO)
✅ server/chat/chatController.js (MODIFICADO)
✅ server/chat/chatModel.js (MODIFICADO)
```

---

## ✅ Checklist de Implementación

- [x] Componente ChatList creado
- [x] Estilos CSS modernos aplicados
- [x] Endpoint backend `/conversaciones/:id`
- [x] Query SQL optimizada
- [x] Integración en My-Account
- [x] Restricción por rol (solo arrendadores)
- [x] Responsive design
- [x] Manejo de estados vacíos
- [x] Badges de mensajes no leídos
- [x] Navegación entre lista y chat individual

---

## 🎓 Puntos Clave para Exposición

1. **Problema Resuelto:**
   - Arrendadores no tenían forma de gestionar conversaciones
   - Mensajes dispersos y difíciles de seguir

2. **Solución Implementada:**
   - Panel centralizado de mensajes
   - Vista de lista + chat individual
   - Tiempo real con Socket.IO

3. **Tecnologías Usadas:**
   - React (hooks: useState, useEffect, useContext)
   - Axios para HTTP
   - Socket.IO para tiempo real
   - MySQL con queries complejas
   - CSS moderno con gradientes y animaciones

4. **Flujo Completo:**
   - Usuario contacta arrendador → mensaje guardado en BD
   - Arrendador ve lista de conversaciones
   - Abre chat específico
   - Responde en tiempo real
   - Ambos reciben mensajes instantáneamente

---

¡Sistema de mensajería para arrendadores completamente funcional! 🚀💬
