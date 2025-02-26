import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigService } from './visualization/config/config.service';
import { AppConfig, VIS_CONFIG } from './app.config';
import { D3Service } from '@crczp/d3-service';
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
import { RadarChartComponent } from './visualization/components/visualizations/radar-chart/radar-chart.component';
import { ClusteringVisualizationConfig } from './visualization/config/trainings-clustering-visualizations';
import { LineChartComponent } from './visualization/components/visualizations/line-chart/line-chart.component';
import { ScatterPlotComponent } from './visualization/components/visualizations/scatter-plot/scatter-plot.component';

@NgModule({
    declarations: [RadarChartComponent, VisualizationsComponent, LineChartComponent, ScatterPlotComponent],
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
        { provide: AppConfig, useValue: VIS_CONFIG },
        { provide: VisualizationDataApi, useClass: VisualizationDataDefaultApi },
        { provide: VisualizationsDataService, useClass: VisualizationsDataConcreteService }, //environment.providers
        // use the environment variable only for local demo deploy to surge
    ],
    exports: [RadarChartComponent, LineChartComponent, ScatterPlotComponent, VisualizationsComponent],
})
export class TrainingsClusteringVisualizationsModule {
    constructor(@Optional() @SkipSelf() parentModule: TrainingsClusteringVisualizationsModule) {
        if (parentModule) {
            throw new Error('TrainingsClusteringVizLibModule is already loaded. Import it in the main module only');
        }
    }

    static forRoot(
        config: ClusteringVisualizationConfig,
    ): ModuleWithProviders<TrainingsClusteringVisualizationsModule> {
        return {
            ngModule: TrainingsClusteringVisualizationsModule,
            providers: [{ provide: ClusteringVisualizationConfig, useValue: config }],
        };
    }
}
