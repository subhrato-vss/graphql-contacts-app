import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {analyzer} from 'vite-bundle-analyzer'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        analyzer()
    ],
    server: {
        port: 3000
    },
    // css: {
    //     transformer: 'lightningcss'
    // },
    // build: {
    // cssMinify: true, // default, but explicit is good
    // cssMinify: 'lightningcss'
    // }
})
