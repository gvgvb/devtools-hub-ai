import { useEffect } from 'react';

type Shortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

export const useKeyboardShortcut = (
  shortcut: Shortcut,
  callback: (event: KeyboardEvent) => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== shortcut.key.toLowerCase() ||
        !!shortcut.ctrl !== event.ctrlKey ||
        !!shortcut.shift !== event.shiftKey ||
        !!shortcut.alt !== event.altKey ||
        !!shortcut.meta !== event.metaKey
      ) {
        return;
      }
      callback(event);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcut, callback, enabled]);
};
