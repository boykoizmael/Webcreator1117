import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-static-game',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            
            // Direct game HTML routes including ultra-long Clever & Green River paths
            const isDirectGame = 
              url === '/game.html' || 
              url.startsWith('/game.html?') ||
              url.includes('/portal.html') ||
              url.includes('student-interactive-lab-simulation.html') ||
              url === '/greenriver/portal.html' ||
              url === '/edu-1117/course-view.html' ||
              url === '/1117/portal.html';

            const isDownload = 
              url === '/download-game' || 
              url.startsWith('/download-game?') ||
              url.startsWith('/download/') ||
              url.includes('download=true');

            if (isDirectGame || isDownload) {
              const filePath = path.resolve(__dirname, 'public/game.html');
              if (fs.existsSync(filePath)) {
                let html = fs.readFileSync(filePath, 'utf-8');
                
                // If accessed via Clever, Green River College, or 1117 path, cloak title
                if (url.includes('clever') || url.includes('clover')) {
                  html = html.replace(/<title>.*?<\/title>/gi, '<title>Clever | Portal - Green River College Student LMS 1117</title>');
                } else if (url.includes('greenriver') || url.includes('1117') || url.includes('edu') || url.includes('learning')) {
                  html = html.replace(/<title>.*?<\/title>/gi, '<title>Green River College | Student Portal - Course EDU 1117</title>');
                }

                const headers: Record<string, string> = {
                  'Content-Type': 'text/html; charset=utf-8',
                  'Cache-Control': 'no-cache',
                  'Access-Control-Allow-Origin': '*',
                };

                if (isDownload) {
                  let filename = 'GRC-EDU-1117-Syllabus.html';
                  if (url.includes('Eaglecraft')) {
                    filename = 'Eaglecraft-1.8.8-Offline.html';
                  } else if (url.includes('Clever') || url.includes('clever')) {
                    filename = 'Clever-GreenRiver-Course1117-Material.html';
                  } else if (url.includes('Education-Priest')) {
                    filename = 'Education-Priest-1117.html';
                  }
                  headers['Content-Disposition'] = `attachment; filename="${filename}"`;
                }

                res.writeHead(200, headers);
                res.end(html);
                return;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
