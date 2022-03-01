import { Observable } from 'rxjs';
import { VisualizationData } from '../models/visualization-data';

/**
 * Service abstracting http communication with visualization data endpoints.
 */
export abstract class VisualizationDataApi {
    /**
     * Sends http request to retrieve all visualization data
     */
    abstract getVisualizationData(trainingInstanceId: number): Observable<VisualizationData>;

    abstract getRadarChartData(trainingInstanceId: number): Observable<VisualizationData>;
  }
