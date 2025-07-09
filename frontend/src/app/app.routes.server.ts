import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'home',
    renderMode: RenderMode.Server
  },
  {
    path: 'event',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'event/:eventId',
    renderMode: RenderMode.Server
  },
  {
    path: 'dream',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dream/create',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dream/event',
    renderMode: RenderMode.Server
  },
  {
    path: 'login',
    renderMode: RenderMode.Server
  },
  {
    path: 'logout',
    renderMode: RenderMode.Server
  },
  {
    path: 'signup',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about-this-project',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'legal',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'legal/*',
    renderMode: RenderMode.Prerender
  },
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
