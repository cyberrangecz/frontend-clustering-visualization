import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClusteringOverviewComponent } from './clustering-overview.component';

const routes: Routes = [
    {
        path: '',
        component: ClusteringOverviewComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClusteringRoutingModule {

}
