import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
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

    headers: HttpHeaders = new HttpHeaders({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Access-Control-Allow-Origin': '*'
    });
    options = ({ headers: this.headers });

  constructor(private http: HttpClient, private configService: ConfigService) {
      super();
    }

  /**
   * Sends http request to retrieve all data for visualizations
   */
  getVisualizationData(trainingDefinitionId: number, featureType: string, numberOfClusters: number, level: string = ""): Observable<VisualizationData> {
    return this.http
      .get<VisualizationDataDTO>(
          this.configService.config.trainingServiceUrl + `visualizations/training-definitions/${trainingDefinitionId}/${featureType}/clusters`
          //`${featureType}/clusters?numberOfClusters=${numberOfClusters}&trainingDefinitionId=${trainingDefinitionId}&level=${level}`, this.options
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
  getRadarChartData(trainingDefinitionId: number, numberOfClusters: number, level: string = ""): Observable<VisualizationData> {
    return this.http
        .get<VisualizationDataDTO>(
            this.configService.config.trainingServiceUrl + `visualizations/training-definitions/${trainingDefinitionId}/radar-chart`
            //`nDimensional/clusters?numberOfClusters=${numberOfClusters}&trainingDefinitionId=${trainingDefinitionId}&level=${level}`, this.options
        )
        .pipe(
            map(
                (response) =>
                    RadarChartDataMapper.fromDTO(response),
            )
        );
  }

  getFeatureSSE(trainingDefinitionId: number, featureType: string, numOfClusters: number, level: string = ""): Observable<SseDataMapper> {
      return this.http
          .get<SseDTO>(
              this.configService.config.trainingServiceUrl + `visualizations/training-definitions/${trainingDefinitionId}/${featureType}/sse`
              //`${featureType}/sse?numberOfClusters=${numOfClusters}&trainingDefinitionId=${trainingDefinitionId}&level=${level}`, this.options
          )
          .pipe(
              map(
                  (response) =>
                      SseDataMapper.fromDTO(response)
              )
          );
  }
}
