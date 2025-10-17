# Documentación de Conexión WebSocket a Kick.com

## Overview

Esta documentación describe cómo establecer una conexión WebSocket ligera a los chats de Kick.com sin manejar autenticación ni credenciales. El enfoque se centra en abstraer la funcionalidad en una librería simple y reutilizable.

## Arquitectura del Sistema

### Componentes Principales

1. **WebSocketManager**: Gestiona la conexión WebSocket
2. **EventEmitter**: Maneja los eventos del chat
3. **MessageParser**: Procesa los mensajes recibidos
4. **Types**: Definiciones de TypeScript para los eventos

## URL del WebSocket

```
wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false
```

## Flujo de Conexión

### 1. Establecer Conexión

```javascript
const ws = new WebSocket(WEBSOCKET_URL);
```

### 2. Suscribirse al Canal

Una vez establecida la conexión, se debe enviar un mensaje de suscripción:

```javascript
const subscribeMessage = {
  event: "pusher:subscribe",
  data: {
    auth: "",
    channel: `chatrooms.${chatroomId}.v2`
  }
};

ws.send(JSON.stringify(subscribeMessage));
```

### 3. Recibir Mensajes

Los mensajes llegan en formato JSON con la siguiente estructura:

```javascript
{
  "event": "App\\Events\\ChatMessageEvent",
  "data": "{\"id\":123,\"content\":\"Hola mundo\",\"user\":{\"username\":\"usuario\"}}"
}
```

## Eventos Disponibles

### Eventos de Chat

- **ChatMessageEvent**: Mensajes de chat
- **MessageDeletedEvent**: Mensajes eliminados
- **PinnedMessageCreatedEvent**: Mensajes fijados
- **PinnedMessageDeletedEvent**: Mensajes fijados eliminados

### Eventos de Usuarios

- **UserBannedEvent**: Usuario baneado
- **UserUnbannedEvent**: Usuario desbaneado

### Eventos de Suscripción

- **SubscriptionEvent**: Nueva suscripción
- **GiftedSubscriptionsEvent**: Suscripciones regaladas

### Eventos de Stream

- **StreamHostEvent**: Host de stream

### Eventos de Polls

- **PollUpdateEvent**: Actualización de encuesta
- **PollDeleteEvent**: Encuesta eliminada

## Implementación Ligera

### Estructura de Archivos

```
websocket-lib/
├── index.ts           # Exportación principal
├── WebSocketManager.ts # Gestor de conexión
├── EventEmitter.ts    # Manejador de eventos
├── MessageParser.ts   # Parser de mensajes
└── types.ts          # Definiciones de tipos
```

### Uso Básico

```typescript
import { KickWebSocket } from './websocket-lib';

// Crear instancia
const kickWS = new KickWebSocket();

// Conectar a un canal
kickWS.connect('nombre-del-canal');

// Escuchar eventos
kickWS.on('ChatMessage', (message) => {
  console.log('Nuevo mensaje:', message.content);
});

kickWS.on('ready', () => {
  console.log('Conectado exitosamente');
});

kickWS.on('disconnect', () => {
  console.log('Desconectado');
});
```

## Consideraciones Técnicas

### Requisitos Mínimos

- Node.js 14+
- WebSocket API nativa o librería compatible
- TypeScript (opcional pero recomendado)

### Limitaciones

- Solo modo lectura (no envía mensajes)
- Sin autenticación requerida
- Conexión pasiva a chats públicos

### Manejo de Errores

```typescript
kickWS.on('error', (error) => {
  console.error('Error de conexión:', error);
});

kickWS.on('close', (code, reason) => {
  console.log(`Conexión cerrada: ${code} - ${reason}`);
});
```

## Optimizaciones de Rendimiento

### Reconección Automática

```typescript
kickWS.autoReconnect = true;
kickWS.reconnectInterval = 5000; // 5 segundos
```

### Buffer de Mensajes

```typescript
kickWS.enableBuffer = true;
kickWS.bufferSize = 1000; // Máximo 1000 mensajes en buffer
```

### Filtrado de Eventos

```typescript
kickWS.filterEvents(['ChatMessage', 'Subscription']);
```

## Ejemplos Prácticos

### Bot Simple de Registro

```typescript
const kickWS = new KickWebSocket();

kickWS.connect('streamer-popular');

kickWS.on('ChatMessage', (msg) => {
  // Guardar mensaje en base de datos
  saveMessage(msg);
});

kickWS.on('UserBanned', (ban) => {
  // Notificar ban de usuario
  notifyBan(ban.username);
});
```

### Analizador de Actividad

```typescript
const activityTracker = new KickWebSocket();
let messageCount = 0;

activityTracker.connect('canal-analizado');

activityTracker.on('ChatMessage', () => {
  messageCount++;
});

setInterval(() => {
  console.log(`Mensajes por minuto: ${messageCount}`);
  messageCount = 0;
}, 60000);
```

## Depuración

### Modo Debug

```typescript
const kickWS = new KickWebSocket({ debug: true });
```

### Eventos Raw

```typescript
kickWS.on('rawMessage', (rawData) => {
  console.log('Mensaje raw:', rawData);
});
```

## Conclusión

Esta implementación proporciona una forma ligera y eficiente de conectar a los WebSockets de Kick.com sin la complejidad de la autenticación. Es ideal para aplicaciones que solo necesitan leer datos del chat, como bots de análisis, sistemas de monitoreo, o herramientas de estadísticas.

La librería está diseñada para ser minimalista, fácil de usar y con una baja huella de memoria, haciéndola perfecta para proyectos donde el rendimiento y la simplicidad son prioridades.