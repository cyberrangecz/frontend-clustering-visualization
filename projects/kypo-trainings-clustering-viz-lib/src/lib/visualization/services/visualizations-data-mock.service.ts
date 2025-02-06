import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Clusterables } from '../models/clusterables-enum';
import { VisualizationData } from '../models/visualization-data';
import featureOneClusters from '../../mock/feature1/clusters.json';
import featureOneSSE from '../../mock/feature1/sse.json';
import featureTwoClusters from '../../mock/feature2/clusters.json';
import featureTwoSSE from '../../mock/feature2/sse.json';
import radarClusters from '../../mock/radar/clusters.json';
import radarSSE from '../../mock/radar/sse.json';
import { VisualizationsDataConcreteService } from './visualizations-data-concrete.service';
import { RadarChartDataMapper } from '../mappers/radar-chart-data-mapper';
import { ClusterVisualizationDataMapper } from '../mappers/cluster-visualization-data-mapper';
import { SseDataMapper } from '../mappers/sse-data-mapper';

/**
 * This class serves for deploy to serge for demonstration purposes
 */
@Injectable({
  providedIn: 'root',
})
export class MockedRestService extends VisualizationsDataConcreteService {
  getData(trainingDefinitionId: number, numOfClusters: number, instanceIds: number[], level: number): any {
    console.log(
      'Mock data for TD' +
        trainingDefinitionId +
        ', TI ' +
        instanceIds +
        ', level ' +
        level +
        '. Number of clusters set to ' +
        numOfClusters,
    );
    switch (this._selectedFeature) {
      case Clusterables.WrongFlags:
        return of(ClusterVisualizationDataMapper.fromDTO({ featureOneClusters }));
      case Clusterables.TimeAfterHint:
        return of(ClusterVisualizationDataMapper.fromDTO({ featureTwoClusters }));
      default:
        return new Observable<VisualizationData>();
    }
  }

  getRadarData(trainingDefinitionId: number, numOfClusters: number, instanceIds: number[], level: number): any {
    console.log(
      'Mock data for TD' +
        trainingDefinitionId +
        ', TI ' +
        instanceIds +
        ', level ' +
        level +
        '. Number of clusters set to ' +
        numOfClusters,
    );
    return of(RadarChartDataMapper.fromDTO(radarClusters));
  }

  getLineData(trainingDefinitionId: number, numOfClusters: number, instanceIds: number[], level: number) {
    console.log(
      'Mock data for TD' +
        trainingDefinitionId +
        ', TI ' +
        instanceIds +
        ', level ' +
        level +
        '. Number of clusters set to ' +
        numOfClusters,
    );
    switch (this._selectedFeature) {
      case Clusterables.WrongFlags:
        return of(SseDataMapper.fromDTO(featureOneSSE));
      case Clusterables.TimeAfterHint:
        return of(SseDataMapper.fromDTO(featureTwoSSE));
      case Clusterables.NDimensional:
        return of(SseDataMapper.fromDTO(radarSSE));
      default:
        return new Observable<VisualizationData>();
    }
  }
}
