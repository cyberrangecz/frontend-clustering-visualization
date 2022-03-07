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
import {Clusterable} from "../models/clusterable";
import {TimeAfterHint} from "../models/time-after-hint";
import {WrongFlags} from "../models/wrong-flags";

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

    getOption(point: Clusterable): number {
        switch (this._selectedFeature) {
            case Clusterables.TimeAfterHint:
                return (point as TimeAfterHint).level;
        }
        return 0;
    }

    getX(value: any): number {
        switch (this._selectedFeature) {
            case Clusterables.WrongFlags:
                return (value as WrongFlags).wrongFlagsSubmittedNormalized;
            case Clusterables.TimeAfterHint:
                return (value as TimeAfterHint).timeSpentAfterHintNormalized;
            case Clusterables.NDimensional:
                break;
        }
        const tmp = value as WrongFlags;
        return tmp.wrongFlagsSubmittedNormalized;
    }

    getY(value: any): number {
        switch (this._selectedFeature) {
            case Clusterables.WrongFlags:
                return (value as WrongFlags).timePlayedNormalized;
            case Clusterables.TimeAfterHint:
                return (value as TimeAfterHint).wrongFlagsAfterHintNormalized;
            case Clusterables.NDimensional:
                break;

        }
        const tmp = value as WrongFlags;
        return tmp.timePlayedNormalized;
    }

    getXLabel(): string {
        switch (this._selectedFeature) {
            case Clusterables.WrongFlags:
                return "Wrong flags";
            case Clusterables.TimeAfterHint:
                return "Time spent after using hint";
        }
        return "X";
    }

    getYLabel(): string {
        switch (this._selectedFeature) {
            case Clusterables.WrongFlags:
                return "Time played";
            case Clusterables.TimeAfterHint:
                return "Wrong flags after using hint";
        }
        return "Y";
    }
}
