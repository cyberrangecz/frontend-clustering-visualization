import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { VisualizationDataDTO } from '../DTOs/visualization-data-dto';
import { VisualizationData } from '../models/visualization-data';
import { VisualizationDataApi } from './visualization-data-api.service';
import {ClusterVisualizationDataMapper} from "../mappers/cluster-visualization-data-mapper";
import {RadarChartDataMapper} from "../mappers/radar-chart-data-mapper";
import {SseDataMapper} from "../mappers/sse-data-mapper";
import {SseDTO} from "../DTOs/sse-dto";

/**
 * Default implementation of service abstracting http communication with visualization data endpoints.
 */
@Injectable()
export class VisualizationDataDefaultApi extends VisualizationDataApi {

  constructor(private http: HttpClient, private configService: ConfigService) {
      super();
    }

  /**
   * Sends http request to retrieve all data for visualizations
   */
  getVisualizationData(trainingDefinitionId: number, featureType: string): Observable<VisualizationData> {
      console.log(featureType)
    return this.http
      .get<VisualizationDataDTO>(
        this.configService.config.trainingServiceUrl + `visualizations/training-definition/${trainingDefinitionId}/${featureType}/clusters`
      )
      .pipe(
        map(
          (response) =>
              ClusterVisualizationDataMapper.fromDTO(response),
        )
      );
  }

    /**
     * Sends http request to retrieve data for radar chart
     */
  getRadarChartData(trainingDefinitionId: number): Observable<VisualizationData> {
    return this.http
        .get<VisualizationDataDTO>(
            this.configService.config.trainingServiceUrl + `visualizations/training-definition/${trainingDefinitionId}/radar-chart`
        )
        .pipe(
            map(
                (response) =>
                    RadarChartDataMapper.fromDTO(response),
            )
        );
  }

  getFeatureSSE(trainingDefinitionId: number, numOfClusters: number, featureType: string): Observable<SseDataMapper> {
      return this.http
          .get<SseDTO>(
              this.configService.config.trainingServiceUrl + `visualizations/training-definition/${trainingDefinitionId}/${featureType}/sse`
          )
          .pipe(
              map(
                  (response) =>
                      SseDataMapper.fromDTO(response)
              )
          );
  }
}
