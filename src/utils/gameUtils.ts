/**
 * Utility functions for Eaglercraft Web
 */

export async function testServerPing(url: string, timeoutMs: number = 4000): Promise<{ ok: boolean; ping: number; error?: string }> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    let isResolved = false;
    let ws: WebSocket | null = null;

    const timer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        if (ws) {
          try { ws.close(); } catch (_) {}
        }
        resolve({ ok: false, ping: timeoutMs, error: 'Connection timed out' });
      }
    }, timeoutMs);

    try {
      ws = new WebSocket(url);

      ws.onopen = () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          const ping = Math.round(performance.now() - startTime);
          try { ws?.close(); } catch (_) {}
          resolve({ ok: true, ping });
        }
      };

      ws.onerror = (e) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          try { ws?.close(); } catch (_) {}
          resolve({ ok: false, ping: 0, error: 'WebSocket failed to connect' });
        }
      };
    } catch (err: any) {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timer);
        resolve({ ok: false, ping: 0, error: err?.message || 'Invalid WebSocket URL' });
      }
    }
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

export function requestFullscreen(element: HTMLElement | null): Promise<void> {
  if (!element) return Promise.reject(new Error('No element provided'));

  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    return (element as any).webkitRequestFullscreen();
  } else if ((element as any).mozRequestFullScreen) {
    return (element as any).mozRequestFullScreen();
  } else if ((element as any).msRequestFullscreen) {
    return (element as any).msRequestFullscreen();
  }
  return Promise.reject(new Error('Fullscreen API not supported'));
}

export function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    return (document as any).webkitExitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    return (document as any).mozCancelFullScreen();
  } else if ((document as any).msExitFullscreen) {
    return (document as any).msExitFullscreen();
  }
  return Promise.resolve();
}

export function isCurrentlyFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}
