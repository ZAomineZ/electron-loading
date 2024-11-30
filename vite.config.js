import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: path.resolve(__dirname, 'styles/style.css'),
            output: {
                assetFileNames: 'style.css'
            }
        },
        emptyOutDir: true,
        outDir: 'dist/source',
        cssCodeSplit: false
    },
    base: './',
    css: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer')
            ]
        }
    }
})