import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AboutThisProjectComponent } from './pages/about-this-project/about-this-project.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PingComponent } from './pages/ping/ping.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'ping',
    component: PingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'about-this-project',
    component: AboutThisProjectComponent
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'legal',
    loadChildren: () => import('./pages/legal/legal.routes').then((mod) => mod.routes)
  },
  {
    path: 'event',
    loadChildren: () => import('./pages/events/event.routes').then((mod) => mod.eventRoutes)
  },
  {
    path: 'ai',
    loadChildren: () => import('./pages/ai/ai.routes').then((mod) => mod.aiRoutes),
  },
  { path: '**', component: NotFoundComponent },


];
