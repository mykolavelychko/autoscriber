# Autoscriber
Autoscriber is a web application designed to facilitate audio recording, processing, and playback. Built with Vue 3 and Vite, this project provides a seamless user experience for handling audio recordings. The core functionalities of Autoscriber include:

- Audio Recording: Users can record audio directly within the application. The recorded audio is saved as a single file.
- Audio Chunking: The application automatically splits the recorded audio into smaller, manageable chunks. This feature is useful for processing and analyzing specific segments of the recording.
- Playback of Audio Chunks: Users can play back individual audio chunks, allowing for easy review and analysis of specific parts of the recording.
- GraphQL Integration: The application uses GraphQL to fetch and manage recording and chunk data, ensuring efficient and flexible data handling.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```