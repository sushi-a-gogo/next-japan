import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LogoutComponent } from './core/auth/logout/logout.component';
import { userGuard } from './features/user/user.guard';
import { AboutThisProjectComponent } from './pages/about-this-project/about-this-project.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PingComponent } from './pages/ping/ping.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { canonicalPath: '/' },
    canActivate: [userGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
    data: { canonicalPath: '/' },
    canActivate: [userGuard]
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
    component: AboutThisProjectComponent,
    pathMatch: 'full',
    data: { canonicalPath: '/about-this-project' }
  },
  {
    path: 'legal',
    loadChildren: () => import('./pages/legal/legal.routes').then((mod) => mod.routes),
    canActivate: [userGuard]
  },
  {
    path: 'event',
    loadChildren: () => import('./features/events/event.routes').then((mod) => mod.eventRoutes),
    canActivate: [userGuard]
  },
  {
    path: 'ai',
    loadChildren: () => import('./features/ai/ai.routes').then((mod) => mod.aiRoutes),
    canActivate: [userGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then((mod) => mod.userRoutes),
    canActivate: [userGuard]
  },
  { path: '**', component: NotFoundComponent },
];
