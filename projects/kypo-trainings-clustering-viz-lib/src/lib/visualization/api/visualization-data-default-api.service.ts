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

    /*
     header('Access-Control-Allow-Origin: *');
     header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
     header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
     */
    headers: HttpHeaders = new HttpHeaders({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
    });
    options = ({ headers: this.headers });

  constructor(private http: HttpClient, private configService: ConfigService) {
      super();
    }

    // http://127.0.0.1:8080/wrongFlags/clusters?numberOfClusters=4&trainingDefinitionId=25
    //147.251.83.5
  /**
   * Sends http request to retrieve all data for visualizations
   */
  getVisualizationData(trainingDefinitionId: number, featureType: string, numberOfClusters: number): Observable<VisualizationData> {
    return this.http
      .get<VisualizationDataDTO>(
          `http://147.251.83.5:8080/${featureType}/clusters?numberOfClusters=${numberOfClusters}&trainingDefinitionId=${trainingDefinitionId}`,
      this.options)
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
  getRadarChartData(trainingDefinitionId: number, numberOfClusters: number): Observable<VisualizationData> {
    return this.http
        .get<VisualizationDataDTO>(
//`visualizations/training-definition/${trainingDefinitionId}/radar-chart`,
            `http://147.251.83.5:8080/nDimensional/clusters?numberOfClusters=${numberOfClusters}&trainingDefinitionId=${trainingDefinitionId}`,
            this.options
        )
        .pipe(
            map(
                (response) =>
                    RadarChartDataMapper.fromDTO(response),
            )
        );
  }

    // http://localhost:8080/wrongFlags/sse?numberOfClusters=10&sandboxId=&trainingInstanceId=&trainingDefinitionId=25&trainingRunId=
  getFeatureSSE(trainingDefinitionId: number, featureType: string, numOfClusters: number): Observable<SseDataMapper> {
      return this.http
          .get<SseDTO>(
          //`visualizations/training-definition/${trainingDefinitionId}/${featureType}/sse`
              `http://147.251.83.5:8080/${featureType}/sse?numberOfClusters=${numOfClusters}&trainingDefinitionId=${trainingDefinitionId}`,
              this.options
          )
          .pipe(
              map(
                  (response) =>
                      SseDataMapper.fromDTO(response)
              )
          );
  }
}
