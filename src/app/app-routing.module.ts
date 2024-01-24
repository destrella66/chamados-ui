import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormLoginComponent } from './seguranca/form-login/form-login.component';

const routes: Routes = [
  { path: 'app', loadChildren: () => import("../app/core/core.module").then((m) => m.CoreModule), },
  { path: 'auth/login', component: FormLoginComponent },
  { path: '**', redirectTo: 'app', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
