import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChamadosPesquisaComponent } from './chamados-pesquisa/chamados-pesquisa.component';
import { ChamadoFormComponent } from './chamado-form/chamado-form.component';

const routes: Routes = [
  { path: '', component: ChamadosPesquisaComponent },
  { path: 'novo', component: ChamadoFormComponent, data: { novoChamado: true } },
  { path: ':id', component: ChamadoFormComponent, data: { modoEdicao: false } },
  { path: ':id/edicao', component: ChamadoFormComponent, data: { modoEdicao: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChamadosRoutingModule { }
