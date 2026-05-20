import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync, rmSync, existsSync } from 'fs';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'public',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                detail: resolve(__dirname, 'detail.html')
            },
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        },
        chunkSizeWarningLimit: 1000
    },
    server: {
        port: 5500,
        open: true,
        proxy: {
            '/equipment': {
                target: 'http://localhost:3001',
                changeOrigin: true
            },
            '/models': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    },
    publicDir: 'static',
    optimizeDeps: {
        include: ['three']
    },
    plugins: [{
        name: 'copy-assets',
        closeBundle: () => {
            // Копируем папку models
            const srcModels = resolve(__dirname, 'models');
            const destModels = resolve(__dirname, 'public/models');

            try {
                if (existsSync(srcModels)) {
                    rmSync(destModels, { recursive: true, force: true });
                    cpSync(srcModels, destModels, { recursive: true });
                    console.log('✅ Модели скопированы в public/models');
                }
            } catch (err) {
                console.log('⚠️ Папка models не найдена');
            }

            // Копируем папку static (изображения)
            const srcStatic = resolve(__dirname, 'static');
            const destStatic = resolve(__dirname, 'public/static');

            try {
                if (existsSync(srcStatic)) {
                    rmSync(destStatic, { recursive: true, force: true });
                    cpSync(srcStatic, destStatic, { recursive: true });
                    console.log('✅ Статические файлы скопированы в public/static');
                }
            } catch (err) {
                console.log('⚠️ Папка static не найдена');
            }
        }
    }]
});
