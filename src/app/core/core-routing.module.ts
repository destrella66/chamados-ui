import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';

export const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'usuarios',
        loadChildren: () =>
          import('../usuarios/usuarios.module').then((m) => m.UsuariosModule)
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('../clientes/clientes.module').then((m) => m.ClientesModule),
      },
      {
        path: 'chamados',
        loadChildren: () =>
          import('../chamados/chamados.module').then((m) => m.ChamadosModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('../produtos/produtos.module').then((m) => m.ProdutosModule)
      },
      {
        path: '',
        redirectTo: 'assistencia',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'app',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
