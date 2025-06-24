import { Routes } from '@angular/router';
import { AcceptableUseComponent } from './acceptable-use/acceptable-use.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { LegalComponent } from './legal.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';

export const routes: Routes = [
  {
    path: '',
    component: LegalComponent,
    children: [
      {
        path: '',
        redirectTo: 'privacy',
        pathMatch: 'full'
      },
      {
        path: 'privacy',
        component: PrivacyComponent
      },
      {
        path: 'tos',
        component: TermsOfServiceComponent
      },
      {
        path: 'cookies',
        component: CookiePolicyComponent
      },
      {
        path: 'acceptable-use',
        component: AcceptableUseComponent
      }
    ]
  }
];
