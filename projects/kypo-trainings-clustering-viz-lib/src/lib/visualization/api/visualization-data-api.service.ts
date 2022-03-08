import { Observable } from 'rxjs';
import { VisualizationData } from '../models/visualization-data';

/**
 * Service abstracting http communication with visualization data endpoints.
 */
export abstract class VisualizationDataApi {
    /**
     * Sends http request to retrieve all visualization data
     */
    abstract getVisualizationData(trainingDefinitionId: number, featureType: string): Observable<VisualizationData>;

    abstract getRadarChartData(trainingDefinitionId: number): Observable<VisualizationData>;

    abstract getFeatureSSE(trainingDefinitionId: number, numOfClusters: number, featureType: string): Observable<VisualizationData>;
  }
