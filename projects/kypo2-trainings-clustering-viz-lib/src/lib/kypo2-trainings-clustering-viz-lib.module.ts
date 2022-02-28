import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigService } from './visualization/config/config.service';
import { AppConfig, CTF_PROGRESS_CONFIG } from './app.config';
import { D3Service } from '@muni-kypo-crp/d3-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { VisualizationDataApi } from './visualization/api/visualization-data-api.service';
import { VisualizationDataDefaultApi } from './visualization/api/visualization-data-default-api.service';
import { VisualizationsDataService } from './visualization/services/visualizations-data.service';
import { VisualizationsDataConcreteService } from './visualization/services/visualizations-data-concrete.service';
import { VisualizationsComponent } from './visualization/components/visualizations/visualizations.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {RadarChartComponent} from "./visualization/components/visualizations/radar-chart/radar-chart.component";
import {ClusteringVisualizationConfig} from "./visualization/config/kypo2-trainings-clustering-viz-lib";


@NgModule({
  declarations: [
    RadarChartComponent,
    VisualizationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
  ],
  providers: [
    D3Service,
    ConfigService,
    { provide: AppConfig, useValue: CTF_PROGRESS_CONFIG },
    { provide: VisualizationDataApi, useClass: VisualizationDataDefaultApi },
    { provide: VisualizationsDataService, useClass: VisualizationsDataConcreteService }
  ],
  exports: [
    RadarChartComponent,
    VisualizationsComponent
  ]
})
export class Kypo2TrainingsClusteringVizLibModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2TrainingsClusteringVizLibModule) {
    if (parentModule) {
      throw new Error(
        'Kypo2TrainingsClusteringVizLibModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: ClusteringVisualizationConfig): ModuleWithProviders<Kypo2TrainingsClusteringVizLibModule> {
    return {
      ngModule: Kypo2TrainingsClusteringVizLibModule,
      providers: [
        {provide: ClusteringVisualizationConfig, useValue: config}
      ]
    };
  }
}
