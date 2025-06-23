import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'event',
    loadChildren: () => import('./event/event.routes').then((mod) => mod.eventRoutes)
  },
  {
    path: 'dream',
    loadChildren: () => import('./dream/dream.routes').then((mod) => mod.dreamRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./sign-up/sign-up.routes').then((mod) => mod.signUpRoutes),
  },
  { path: '**', component: NotFoundComponent },


];
