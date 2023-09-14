import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [svelte(), glsl()]
});
