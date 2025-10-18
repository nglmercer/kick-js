// Archivo principal de exportación de la librería WebSocket de Kick.com
export { WebSocketManager } from "./WebSocketManager.js";
export { EventEmitter } from "./EventEmitter.js";
export { MessageParser } from "./MessageParser.js";

// Exportar tipos
export type {
  KickMessage,
  KickUser,
  KickChannel,
  ChatMessageEvent,
  MessageDeletedEvent,
  UserBannedEvent,
  UserUnbannedEvent,
  SubscriptionEvent,
  GiftedSubscriptionsEvent,
  PinnedMessageCreatedEvent,
  StreamHostEvent,
  PollUpdateEvent,
  PollDeleteEvent,
  KickEventType,
  KickEventData,
  KickWebSocketOptions,
  WebSocketMessage,
  ConnectionState,
  EventHandler,
  IKickWebSocket,
  EventDataMap,
} from "./types.js";

// Clase principal simplificada para uso fácil
import { WebSocketManager } from "./WebSocketManager.js";
import type {
  KickWebSocketOptions,
  KickEventType,
  EventHandler,
} from "./types.js";

/**
 * Clase principal para conectar a los WebSockets de Kick.com
 *
 * Ejemplo de uso:
 * ```typescript
 * import { KickWebSocket } from './websocket-lib';
 *
 * const kickWS = new KickWebSocket({ debug: true });
 *
 * kickWS.connect('nombre-del-canal');
 *
 * kickWS.on('ChatMessage', (message) => {
 *   console.log('Nuevo mensaje:', message.content);
 * });
 *
 * kickWS.on('ready', () => {
 *   console.log('Conectado exitosamente');
 * });
 * ```
 */
export class KickWebSocket extends WebSocketManager {
  constructor(options: KickWebSocketOptions = {}) {
    super(options);
  }

  /**
   * Método de conveniencia para escuchar todos los eventos
   */
  onAllEvents(handler: EventHandler<unknown>): void {
    const events: KickEventType[] = [
      "ChatMessage",
      "MessageDeleted",
      "UserBanned",
      "UserUnbanned",
      "Subscription",
      "GiftedSubscriptions",
      "PinnedMessageCreated",
      "StreamHost",
      "PollUpdate",
      "PollDelete",
    ];

    events.forEach((event) => {
      this.on(event, handler);
    });
  }

  /**
   * Método de conveniencia para escuchar solo eventos de chat
   */
  onChatEvents(handler: EventHandler<unknown>): void {
    const chatEvents: KickEventType[] = [
      "ChatMessage",
      "MessageDeleted",
      "PinnedMessageCreated",
    ];

    chatEvents.forEach((event) => {
      this.on(event, handler);
    });
  }

  /**
   * Método de conveniencia para escuchar solo eventos de usuarios
   */
  onUserEvents(handler: EventHandler<unknown>): void {
    const userEvents: KickEventType[] = [
      "UserBanned",
      "UserUnbanned",
      "Subscription",
      "GiftedSubscriptions",
    ];

    userEvents.forEach((event) => {
      this.on(event, handler);
    });
  }

  /**
   * Método de conveniencia para escuchar solo eventos de stream
   */
  onStreamEvents(handler: EventHandler<unknown>): void {
    const streamEvents: KickEventType[] = [
      "StreamHost",
      "PollUpdate",
      "PollDelete",
    ];

    streamEvents.forEach((event) => {
      this.on(event, handler);
    });
  }

  /**
   * Crea una instancia configurada para modo de bajo consumo
   */
  static createLightweight(channelName?: string): KickWebSocket {
    const ws = new KickWebSocket({
      debug: false,
      autoReconnect: true,
      reconnectInterval: 10000,
      enableBuffer: false,
      filteredEvents: ["ChatMessage"], // Solo mensajes de chat
    });

    if (channelName) {
      ws.connect(channelName).catch(console.error);
    }

    return ws;
  }

  /**
   * Crea una instancia configurada para modo de debug
   */
  static createDebug(channelName?: string): KickWebSocket {
    const ws = new KickWebSocket({
      debug: true,
      autoReconnect: true,
      reconnectInterval: 3000,
      enableBuffer: true,
      bufferSize: 500,
    });

    if (channelName) {
      ws.connect(channelName).catch(console.error);
    }

    return ws;
  }

  /**
   * Crea una instancia configurada para análisis de datos
   */
  static createAnalytics(channelName?: string): KickWebSocket {
    const ws = new KickWebSocket({
      debug: false,
      autoReconnect: true,
      reconnectInterval: 5000,
      enableBuffer: true,
      bufferSize: 2000,
      filteredEvents: [
        "ChatMessage",
        "UserBanned",
        "Subscription",
        "GiftedSubscriptions",
      ],
    });

    if (channelName) {
      ws.connect(channelName).catch(console.error);
    }

    return ws;
  }
}

// Exportar por defecto la clase principal
export default KickWebSocket;

// Versión de la librería
export const VERSION = "1.0.0";

// Información de la librería
export const LIB_INFO = {
  name: "kick-websocket-lite",
  version: VERSION,
  description: "Librería ligera para conectar a WebSockets de Kick.com",
  author: "Kick.js Team",
  repository: "https://github.com/retconned/kick-js",
  license: "MIT",
};

// ========================================
// Browser-specific features
// ========================================

// Información de compatibilidad con navegador
export const BROWSER_INFO = {
  supported: true,
  features: {
    websockets: typeof WebSocket !== "undefined",
    fetch: typeof fetch !== "undefined",
    eventSource: typeof EventSource !== "undefined",
  },
  requirements: {
    websockets: "WebSocket API support required",
    fetch: "Fetch API support required (or polyfill)",
  },
};

// Función de ayuda para verificar compatibilidad
export function checkBrowserCompatibility(): {
  compatible: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Verificar WebSocket
  if (typeof WebSocket === "undefined") {
    missing.push("WebSocket API is not supported");
  }

  // Verificar Fetch
  if (typeof fetch === "undefined") {
    missing.push("Fetch API is not supported");
    warnings.push("Consider adding a fetch polyfill for older browser support");
  }

  // Verificar soporte para ES2020
  try {
    // Test some ES2020 features
    new Promise(() => {});
    const test = { ...{ a: 1 } };
    const asyncTest = async () => {};
  } catch (e) {
    missing.push("ES2020 features not supported");
  }

  return {
    compatible: missing.length === 0,
    missing,
    warnings,
  };
}

// Función de ayuda para crear instancia con verificación de compatibilidad
export function createKickWebSocket(options?: KickWebSocketOptions): {
  instance: KickWebSocket;
  compatibility: ReturnType<typeof checkBrowserCompatibility>;
} {
  const compatibility = checkBrowserCompatibility();

  if (!compatibility.compatible) {
    console.error(
      "Kick WebSocket Lite - Browser compatibility issues:",
      compatibility.missing,
    );
    throw new Error(
      `Browser not compatible: ${compatibility.missing.join(", ")}`,
    );
  }

  if (compatibility.warnings.length > 0) {
    console.warn(
      "Kick WebSocket Lite - Browser warnings:",
      compatibility.warnings,
    );
  }

  const instance = new KickWebSocket(options);
  return { instance, compatibility };
}

// Detectar si estamos en un navegador
export const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

// Información de depuración para navegador
if (isBrowser && typeof window !== "undefined") {
  (window as any).KickWebSocketLite = {
    VERSION,
    BROWSER_INFO,
    checkBrowserCompatibility,
    createKickWebSocket,
    isBrowser,
  };
}
