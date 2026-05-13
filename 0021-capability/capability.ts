// Copyright (c) 2026 Marco Nikander

export interface Log {
  log: (s: string) => void;
}

export interface KeyValueStore<K, V> {
  store: (key: K, value: V) => void;
  load: (key: K) => undefined | V;
}

export function make_console_logger(): Log {
  return {
    log: (s: string) => {
      return console.log(s);
    },
  };
}

export function make_local_kv_store<K, V>(): KeyValueStore<K, V> {
  const data = new Map<K, V>();
  return {
    store: (key, value) => {
      data.set(key, value);
    },
    load: (key) => {
      const value = data.get(key);
      return value;
    },
  };
}
