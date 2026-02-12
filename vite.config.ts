import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        chunkSizeWarningLimit: 2048,
        rolldownOptions: {
            input: {
                auth: 'auth.html',
                index: 'index.html',
                editor: 'editor.html',
                legal: 'legal.html'
            }
        }
    }
})