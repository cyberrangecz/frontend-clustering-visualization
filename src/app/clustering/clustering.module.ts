import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ClusteringOverviewComponent} from './clustering-overview.component';
import {ClusteringRoutingModule} from './clustering-routing.module';
import {CustomConfig} from '../custom-config';
import {KypoTrainingsClusteringVizLibModule} from '../../../projects/kypo-trainings-clustering-viz-lib/src/public_api';

@NgModule({
  declarations: [
    ClusteringOverviewComponent
  ],
  imports: [
    CommonModule,
    ClusteringRoutingModule,
    KypoTrainingsClusteringVizLibModule.forRoot(CustomConfig)
  ],
  exports: [
    ClusteringOverviewComponent
  ]
})
export class ClusteringModule {
}
