import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VisualizationDataApi } from '../api/visualization-data-api.service';
import { VisualizationData } from '../models/visualization-data';
import { VisualizationsDataService } from './visualizations-data.service';
import {ClusterVisualizationDataMapper} from "../mappers/cluster-visualization-data-mapper";
import {RadarChartDataMapper} from "../mappers/radar-chart-data-mapper";
import {Clusterables} from "../models/clusterables-enum";
import {SseDataMapper} from "../mappers/sse-data-mapper";

@Injectable()
export class VisualizationsDataConcreteService extends VisualizationsDataService{

    private readonly messageBase = 'VisualizationsDataService not connect to API: ';
    private _selectedFeature: Clusterables;

    set selectedFeature(value: Clusterables) {
        this._selectedFeature = value;
    }

    constructor(private visualizationApi: VisualizationDataApi) {
      super();
    }

    getData(trainingInstanceId: number): Observable<VisualizationData> {
        return this.visualizationApi.getVisualizationData(trainingInstanceId).pipe(
            map((data: any) => ClusterVisualizationDataMapper.fromDTO(data)),
            catchError((error) => {
                return throwError(this.messageBase + error.message);
            })
        );

    }

    getRadarData(trainingInstanceId: number): Observable<VisualizationData> {
        return this.visualizationApi.getRadarChartData(trainingInstanceId).pipe(
            map((data: any) => RadarChartDataMapper.fromDTO(data)),
            catchError((error) => {
                return throwError(this.messageBase + error.message);
            })
        );
    }

    getLineData(trainingInstanceId: number, numOfClusters: number): Observable<any> {
        switch (this._selectedFeature) {
            case Clusterables.WrongFlags:
                return this.visualizationApi.getFeatureOneSSE(trainingInstanceId, numOfClusters).pipe(
                    map((data: any) => SseDataMapper.fromDTO(data)),
                    catchError((error) => {
                        return throwError(this.messageBase + error.message);
                    })
                );
            case Clusterables.TimeAfterHint:
                return this.visualizationApi.getFeatureTwoSSE(trainingInstanceId, numOfClusters).pipe(
                    map((data: any) => SseDataMapper.fromDTO(data)),
                    catchError((error) => {
                        return throwError(this.messageBase + error.message);
                    })
                );
            case Clusterables.NDimensional:
                return this.visualizationApi.getNDimensionalSSE(trainingInstanceId, numOfClusters).pipe(
                    map((data: any) => SseDataMapper.fromDTO(data)),
                    catchError((error) => {
                        return throwError(this.messageBase + error.message);
                    })
                );
        }
    }
}
