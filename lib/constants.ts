export const languageOptions = [
  "plaintext",
  "python",
  "javascript",
  "typescript",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "swift",
  "kotlin",
  "ruby",
  "php",
  "html",
  "css",
  "sql",
  "bash",
  "yaml",
  "json",
];

export const editorThemes = {
  vs: "Light",
  "vs-dark": "Dark",
  "hc-black": "High Contrast Dark",
  "hc-light": "High Contrast Light",
  "github-light": "GitHub Light",
  "github-dark": "GitHub Dark",
};

export type EditorThemeName = keyof typeof editorThemes;
