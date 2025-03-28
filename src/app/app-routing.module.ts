import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SentinelAuthProviderListComponent } from '@sentinel/auth/components';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./clustering/clustering.module').then(m => m.ClusteringModule),
        canActivate: [SentinelAuthGuardWithLogin],
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: SentinelAuthProviderListComponent,
        canActivate: [SentinelNegativeAuthGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
