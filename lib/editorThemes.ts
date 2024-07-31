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
