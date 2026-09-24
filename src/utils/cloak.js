export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'SHHH Dont tell the teachers (Default)',
    title: 'SHHH Dont tell the teachers',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas LMS',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  }
];

export function applyCloak(presetId) {
  const preset = CLOAK_PRESETS.find(p => p.id === presetId) || CLOAK_PRESETS[0];
  document.title = preset.title;

  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = preset.icon;
}

export function triggerPanic() {
  window.location.href = 'https://www.google.com';
}
