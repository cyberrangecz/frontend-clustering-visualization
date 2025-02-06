import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClusteringOverviewComponent } from './clustering-overview.component';
import { ClusteringRoutingModule } from './clustering-routing.module';
import { CustomConfig } from '../custom-config';
import {
    KypoTrainingsClusteringVizLibModule
} from '../../../projects/kypo-trainings-clustering-viz-lib/src/public_api';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
        ClusteringOverviewComponent
    ],
    imports: [
        CommonModule,
        ClusteringRoutingModule,
        KypoTrainingsClusteringVizLibModule.forRoot(CustomConfig),
        MatSidenavModule,
        MatButtonModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
        ClusteringOverviewComponent
    ]
})
export class ClusteringModule {
}
