import { writable } from 'svelte/store';

// Define the initial theme value
let theme = localStorage.getItem('theme-preference');
if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

// Create a writable store
export const themeStore = writable(theme);
