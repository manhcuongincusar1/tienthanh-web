// S5/09 — Permission cache invalidate UX (DECISIONS C5 — Redis TTL 1h + invalidate explicit).
// Pattern:
//   1. Poll `getUserInfo` mỗi 5 phút khi tab visible.
//   2. So sánh `permission_data` shape; thay đổi → set state cờ + broadcast cross-tab.
//   3. Caller lắng nghe `onPermissionChanged` để show banner / re-render menu.

import { authService } from '@/services/authService';
import { broadcastAuth } from './authChannel';

const POLL_INTERVAL_MS = 5 * 60 * 1000;

type PermissionListener = () => void;
const listeners: PermissionListener[] = [];

let lastSnapshot = '';
let timer: ReturnType<typeof setInterval> | null = null;

function snapshot(currentUser: any): string {
  if (!currentUser) return '';
  // accessVersion ưu tiên (cần BE add field — nếu chưa có thì hash permission_data).
  if (typeof currentUser.accessVersion === 'number') {
    return `v:${currentUser.accessVersion}`;
  }
  try {
    return 'p:' + JSON.stringify(currentUser.permission_data ?? null).slice(0, 2000);
  } catch {
    return 'p:err';
  }
}

export function onPermissionChanged(fn: PermissionListener): () => void {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export async function refreshPermission(): Promise<any | null> {
  try {
    const fresh: any = await authService.getUserInfo();
    if (!fresh) return null;
    const snap = snapshot(fresh);
    if (lastSnapshot && snap !== lastSnapshot) {
      listeners.forEach((fn) => {
        try { fn(); } catch (e) { console.error('[permission] listener', e); }
      });
      broadcastAuth({ type: 'permission_changed', accessVersion: fresh.accessVersion });
    }
    lastSnapshot = snap;
    return fresh;
  } catch (e) {
    return null;
  }
}

export function startPermissionPoll(initialUser?: any): void {
  if (timer) return; // idempotent
  lastSnapshot = snapshot(initialUser);
  if (typeof window === 'undefined') return;
  timer = setInterval(() => {
    if (document.visibilityState === 'visible') {
      refreshPermission();
    }
  }, POLL_INTERVAL_MS);
}

export function stopPermissionPoll(): void {
  if (timer) clearInterval(timer);
  timer = null;
}
