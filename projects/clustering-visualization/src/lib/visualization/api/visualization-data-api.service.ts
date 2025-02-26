import { Observable } from 'rxjs';
import { ClusteringVisualizationData } from '../models/clustering-visualization-data';

/**
 * Service abstracting http communication with visualization data endpoints.
 */
export abstract class VisualizationDataApi {
    /**
     * Sends http request to retrieve all visualization data
     */
    abstract getVisualizationData(
        trainingDefinitionId: number,
        featureType: string,
        numberOfClusters: number,
        instanceIds: number[],
        level: number,
    ): Observable<ClusteringVisualizationData>;

    abstract getRadarChartData(
        trainingDefinitionId: number,
        numberOfClusters: number,
        instanceIds: number[],
        level: number,
    ): Observable<ClusteringVisualizationData>;

    abstract getFeatureSSE(
        trainingDefinitionId: number,
        featureType: string,
        numberOfClusters: number,
        instanceIds: number[],
        level: number,
    ): Observable<ClusteringVisualizationData>;
}
