import { TabCloakPreset } from '../types';

export const CLOAK_PRESETS: TabCloakPreset[] = [
  {
    id: 'clever',
    name: 'Clever / Clover Portal (Green River 1117)',
    title: 'Clever | Portal - Green River College Student LMS 1117',
    icon: 'https://assets.clever.com/assets/favicon.ico',
    description: 'Undetectable disguise matching the school district Clever SSO portal.',
    badge: 'Clever / Clover',
    isCollege: true
  },
  {
    id: 'greenriver',
    name: 'Green River College (EDU-1117)',
    title: 'Green River College | Canvas Student Portal - EDU 1117',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    description: 'Undetectable disguise matching Green River College Canvas LMS (EDU-1117).',
    badge: 'Recommended',
    isCollege: true
  },
  {
    id: 'education_priest',
    name: 'Education Priest / Portal (1117)',
    title: 'Education Priest Academic Portal - Course Ref 1117',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png',
    description: 'Academic curriculum portal for Education Priest Course 1117.',
    badge: 'Undetectable',
    isCollege: true
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png',
    description: 'Disguises this tab as Google Classroom.'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    description: 'Disguises this tab as an active Google Doc.'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    description: 'Disguises this tab as Canvas student portal.'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico',
    description: 'Disguises this tab as a math graphing calculator.'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    description: 'Disguises this tab as Google Drive file manager.'
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    title: 'Khan Academy | Free Online Courses, Lessons & Practice',
    icon: 'https://cdn.kastatic.org/images/favicon.ico',
    description: 'Disguises this tab as educational lesson modules.'
  },
  {
    id: 'default',
    name: 'Normal (Eaglecraft)',
    title: 'Eaglecraft Web - Minecraft 1.8.8',
    icon: '/favicon.ico',
    description: 'Default Minecraft gaming title and icon.'
  }
];

export function applyTabCloak(preset: TabCloakPreset) {
  try {
    document.title = preset.title;
    
    // Find or create favicon
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.href = preset.icon;

    localStorage.setItem('eaglecraft_tab_cloak', preset.id);
  } catch (err) {
    console.error('Failed to apply tab cloak', err);
  }
}

export function getSavedTabCloak(): TabCloakPreset {
  try {
    const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    if (path.includes('clever') || path.includes('clover')) {
      return CLOAK_PRESETS[0]; // Clever
    }
    if (path.includes('greenriver') || path.includes('1117') || path.includes('edu') || path.includes('learning')) {
      return CLOAK_PRESETS[1]; // Green River College
    }

    const savedId = localStorage.getItem('eaglecraft_tab_cloak');
    if (savedId) {
      const match = CLOAK_PRESETS.find(p => p.id === savedId);
      if (match) return match;
    }
  } catch (_) {}
  // Default to Clever preset for school bypass
  return CLOAK_PRESETS[0];
}

export function triggerPanic(redirectUrl: string = 'https://clever.com') {
  try {
    window.location.replace(redirectUrl);
  } catch (_) {
    window.location.href = redirectUrl;
  }
}

export function launchAboutBlank(gameUrl: string = '/greenriver/portal.html', cloak?: TabCloakPreset) {
  const chosenCloak = cloak || CLOAK_PRESETS[0]; // Clever / Green River by default
  
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Pop-up was blocked by your browser. Please allow pop-ups for this site so the stealth window can open.');
    return false;
  }

  try {
    const doc = win.document;
    doc.title = chosenCloak.title;
    
    const icon = doc.createElement('link');
    icon.rel = 'shortcut icon';
    icon.href = chosenCloak.icon;
    doc.head.appendChild(icon);

    const fullGameUrl = gameUrl.startsWith('http') 
      ? gameUrl 
      : `${window.location.origin}${gameUrl.startsWith('/') ? '' : '/'}${gameUrl}`;

    const iframe = doc.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.src = fullGameUrl;
    iframe.setAttribute('allow', 'fullscreen; pointer-lock; autoplay; camera; microphone; keyboard-map');
    iframe.setAttribute('allowfullscreen', 'true');

    doc.body.style.margin = '0';
    doc.body.style.padding = '0';
    doc.body.style.overflow = 'hidden';
    doc.body.style.backgroundColor = '#000';
    doc.body.appendChild(iframe);

    return true;
  } catch (err) {
    console.error('Error launching about:blank window', err);
    return false;
  }
}

export function downloadOfflineGame(targetUrl: string = '/download/GRC-EDU-1117-Syllabus.html', filename: string = 'GRC-EDU-1117-Syllabus.html') {
  const link = document.createElement('a');
  link.href = targetUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function launchBlobUrl(activeCloak?: TabCloakPreset) {
  try {
    const res = await fetch('/game.html');
    const html = await res.text();
    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (win && activeCloak) {
      win.document.title = activeCloak.title;
    }
    return true;
  } catch (err) {
    console.error('Failed to launch Blob URL', err);
    return false;
  }
}
