import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    envDir: "../",
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8000/",
                changeOrigin: true
            }
        }
    },
    plugins: [
        tailwindcss(),
    ],
    build: {
        chunkSizeWarningLimit: 2048,
        rolldownOptions: {
            input: {
                '404': '404.html',
                auth: 'auth.html',
                index: 'index.html',
                dashboard: 'dashboard.html',
                quiz: 'quiz.html',
                editor: 'editor.html',
                legal: 'legal.html',
                temp: 'temp.html'
            }
        }
    }
})