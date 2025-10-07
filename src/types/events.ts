export interface MessageEvent {
  event: string;
  data: string;
  channel: string;
}

export interface MessageData {
  id: string;
  chatroom_id: number;
  content: string;
  type: string;
  created_at: string;
  sender: {
    id: number;
    username: string;
    slug: string;
    identity: { color: string; badges: unknown };
  };
  metadata?: {
    original_sender: { id: string; username: string };
    original_message: {
      id: string;
      content: string;
    };
  };
}

export interface SubscriptionData {
  username: string;
  months: number;
}

export interface ChatMessage {
  id: string;
  chatroom_id: number;
  content: string;
  type: string;
  created_at: string;
  sender: {
    id: number;
    username: string;
    slug: string;
    identity: { color: string; badges: unknown };
  };
}

export interface Subscription {
  chatroom_id: number;
  username: string;
  months: number;
}

export interface GiftedSubscriptionsEvent {
  chatroom_id: number;
  gifted_usernames: string[];
  gifter_username: string;
}

export interface StreamHostEvent {
  chatroom_id: number;
  optional_message: string;
  number_viewers: number;
  host_username: string;
}

export interface MessageDeletedEvent {
  id: string;
  message: {
    id: string;
  };
}

export interface UserBannedEvent {
  id: string;
  user: {
    id: number;
    username: string;
    slug: string;
  };

  banned_by: {
    id: number;
    username: string;
    slug: string;
  };

  expires_at?: Date;
}

export interface UserUnbannedEvent {
  id: string;
  user: {
    id: number;
    username: string;
    slug: string;
  };
  unbanned_by: {
    id: number;
    username: string;
    slug: string;
  };
}

export interface PinnedMessageCreatedEvent {
  message: {
    id: string;
    chatroom_id: number;
    content: string;
    type: string;
    created_at: Date;
    sender: {
      id: number;
      username: string;
      slug: string;
      identity: {
        color: string;
        badges: Array<{
          type: string;
          text: string;
          count?: number;
        }>;
      };
    };
    metadata: null;
  };
  duration: string;
}

// Event handler types for better type safety
export type RawMessageHandler = (rawMessage: string) => void;
