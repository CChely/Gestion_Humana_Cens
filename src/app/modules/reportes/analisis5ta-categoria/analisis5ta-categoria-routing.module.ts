import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Analisis5taCategoriaComponent } from './analisis5ta-categoria.component';

const routes: Routes = [
    { path: '', component: Analisis5taCategoriaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Analisis5taCategoriaRoutingModule { }
