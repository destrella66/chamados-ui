import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutosPesquisaComponent } from './produtos-pesquisa/produtos-pesquisa.component';
import { ProdutoFormComponent } from './produto-form/produto-form.component';

const routes: Routes = [
  { path: '', component: ProdutosPesquisaComponent },
  { path: 'novo', component: ProdutoFormComponent },
  { path: ':id', component: ProdutoFormComponent, data: { modoVisualizacao: true } },
  { path: ':id/edicao', component: ProdutoFormComponent, data: { modoEdicao: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutosRoutingModule { }
