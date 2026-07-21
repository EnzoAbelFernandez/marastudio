// ─────────────────────────────────────────────
// GLSL Shader Module Declarations
// ─────────────────────────────────────────────
// Allows TypeScript to understand .vert/.frag/.glsl imports
// These files are loaded as raw strings via webpack's asset/source

declare module '*.vert' {
  const content: string;
  export default content;
}

declare module '*.frag' {
  const content: string;
  export default content;
}

declare module '*.glsl' {
  const content: string;
  export default content;
}
