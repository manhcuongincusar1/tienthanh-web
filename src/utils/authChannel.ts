// S5/09 — BroadcastChannel cross-tab logout/permission sync.
// Browser cũ (IE, Safari < 15.4) không có BroadcastChannel → silent skip.

export type AuthEvent =
  | { type: 'logout' }
  | { type: 'permission_changed'; accessVersion?: number };

const CHANNEL_NAME = 'tita-auth';

const channel: BroadcastChannel | null =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;

type Listener = (e: AuthEvent) => void;
const listeners: Listener[] = [];

if (channel) {
  channel.onmessage = (e) => {
    const data = e.data as AuthEvent;
    if (!data || !data.type) return;
    listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error('[authChannel] listener error', err);
      }
    });
  };
}

export function broadcastAuth(event: AuthEvent): void {
  channel?.postMessage(event);
}

export function onAuthEvent(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}
