// lib/editorThemes.ts

export const githubLight = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6a737d" },
    { token: "keyword", foreground: "d73a49" },
    { token: "string", foreground: "032f62" },
    { token: "number", foreground: "005cc5" },
    { token: "type", foreground: "6f42c1" },
  ],
  colors: {
    "editor.foreground": "#24292e",
    "editor.background": "#ffffff",
    "editor.selectionBackground": "#0366d625",
    "editor.lineHighlightBackground": "#f1f8ff",
    "editorCursor.foreground": "#24292e",
    "editorWhitespace.foreground": "#bbb",
  },
};

export const githubDark = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6a737d" },
    { token: "keyword", foreground: "ff7b72" },
    { token: "string", foreground: "a5d6ff" },
    { token: "number", foreground: "79c0ff" },
    { token: "type", foreground: "d2a8ff" },
  ],
  colors: {
    "editor.foreground": "#c9d1d9",
    "editor.background": "#0d1117",
    "editor.selectionBackground": "#3b5070",
    "editor.lineHighlightBackground": "#161b22",
    "editorCursor.foreground": "#c9d1d9",
    "editorWhitespace.foreground": "#484f58",
  },
};

export const hackerBlue = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "5c6370" },
    { token: "keyword", foreground: "00d9ff" },
    { token: "string", foreground: "00ffcc" },
    { token: "number", foreground: "00aaff" },
    { token: "type", foreground: "00ff99" },
  ],
  colors: {
    "editor.foreground": "#00ffcc",
    "editor.background": "#001f3f",
    "editor.selectionBackground": "#005f87",
    "editor.lineHighlightBackground": "#003366",
    "editorCursor.foreground": "#00d9ff",
    "editorWhitespace.foreground": "#005f87",
  },
};

export const ultraFocus = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "4b5263" },
    { token: "keyword", foreground: "ffcc00" },
    { token: "string", foreground: "b8ff9f" },
    { token: "number", foreground: "ff6f61" },
    { token: "type", foreground: "ff0099" },
  ],
  colors: {
    "editor.foreground": "#ffffff",
    "editor.background": "#0a0e14",
    "editor.selectionBackground": "#1e222a",
    "editor.lineHighlightBackground": "#141820",
    "editorCursor.foreground": "#ffffff",
    "editorWhitespace.foreground": "#3a3f4b",
  },
};

export const solarizedChroma = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "comment", foreground: "93a1a1" },
    { token: "keyword", foreground: "268bd2" },
    { token: "string", foreground: "2aa198" },
    { token: "number", foreground: "d33682" },
    { token: "type", foreground: "cb4b16" },
  ],
  colors: {
    "editor.foreground": "#586e75",
    "editor.background": "#fdf6e3",
    "editor.selectionBackground": "#eee8d5",
    "editor.lineHighlightBackground": "#fdf6e3",
    "editorCursor.foreground": "#657b83",
    "editorWhitespace.foreground": "#93a1a1",
  },
};

export const solarizedLight = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "comment", foreground: "586e75" },
    { token: "keyword", foreground: "859900" },
    { token: "string", foreground: "2aa198" },
    { token: "number", foreground: "b58900" },
    { token: "type", foreground: "268bd2" },
  ],
  colors: {
    "editor.foreground": "#657b83",
    "editor.background": "#fdf6e3",
    "editor.selectionBackground": "#eee8d5",
    "editor.lineHighlightBackground": "#eee8d5",
    "editorCursor.foreground": "#657b83",
    "editorWhitespace.foreground": "#93a1a1",
  },
};

export const solarizedDark = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "839496" },
    { token: "keyword", foreground: "b58900" },
    { token: "string", foreground: "2aa198" },
    { token: "number", foreground: "d33682" },
    { token: "type", foreground: "268bd2" },
  ],
  colors: {
    "editor.foreground": "#839496",
    "editor.background": "#002b36",
    "editor.selectionBackground": "#073642",
    "editor.lineHighlightBackground": "#073642",
    "editorCursor.foreground": "#93a1a1",
    "editorWhitespace.foreground": "#586e75",
  },
};
