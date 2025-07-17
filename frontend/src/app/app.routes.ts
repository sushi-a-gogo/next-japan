import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { authGuard } from './guards/auth.guard';
import { AboutThisProjectComponent } from './pages/about-this-project/about-this-project.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
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
    path: 'signup',
    loadChildren: () => import('./pages/sign-up/sign-up.routes').then((mod) => mod.signUpRoutes),
  },
  {
    path: 'event',
    loadChildren: () => import('./pages/events/event.routes').then((mod) => mod.eventRoutes)
  },
  {
    path: 'ai',
    loadChildren: () => import('./pages/ai/ai.routes').then((mod) => mod.aiRoutes),
    canActivate: [authGuard]
  },
  { path: '**', component: NotFoundComponent },


];
