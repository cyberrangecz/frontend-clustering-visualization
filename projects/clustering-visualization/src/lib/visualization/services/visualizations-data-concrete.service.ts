import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VisualizationDataApi } from '../api/visualization-data-api.service';
import { ClusteringVisualizationData } from '../models/clustering-visualization-data';
import { VisualizationsDataService } from './visualizations-data.service';
import { ClusterVisualizationDataMapper } from '../mappers/cluster-visualization-data-mapper';
import { RadarChartDataMapper } from '../mappers/radar-chart-data-mapper';
import { Clusterables } from '../models/clusterables-enum';
import { SseDataMapper } from '../mappers/sse-data-mapper';
import { Clusterable } from '../models/clusterable';
import { TimeAfterHint } from '../models/time-after-hint';
import { WrongFlags } from '../models/wrong-flags';

@Injectable()
export class VisualizationsDataConcreteService extends VisualizationsDataService {
    private readonly messageBase = 'VisualizationsDataService cannot connect to API: ';
    protected _selectedFeature: Clusterables;

    set selectedFeature(value: Clusterables) {
        this._selectedFeature = value;
    }

    get selectedFeature(): Clusterables {
        return this._selectedFeature;
    }

    constructor(private visualizationApi: VisualizationDataApi) {
        super();
    }

    getData(
        trainingDefinitionId: number,
        numOfClusters: number,
        instanceIds: number[],
        level: number,
    ): Observable<ClusteringVisualizationData> {
        switch (this._selectedFeature) {
            case Clusterables.WrongFlags:
                return this.visualizationApi
                    .getVisualizationData(trainingDefinitionId, 'wrong-answers', numOfClusters, instanceIds, level)
                    .pipe(
                        map((data: any) => ClusterVisualizationDataMapper.fromDTO(data)),
                        catchError((error) => {
                            return throwError(this.messageBase + error.message);
                        }),
                    );
            case Clusterables.TimeAfterHint:
                return this.visualizationApi
                    .getVisualizationData(trainingDefinitionId, 'hints', numOfClusters, instanceIds, level)
                    .pipe(
                        map((data: any) => ClusterVisualizationDataMapper.fromDTO(data)),
                        catchError((error) => {
                            return throwError(this.messageBase + error.message);
                        }),
                    );
            default:
                return new Observable<ClusteringVisualizationData>();
        }
    }

    getRadarData(
        trainingDefinitionId: number,
        numOfClusters: number,
        instanceIds: number[],
        level: number,
    ): Observable<ClusteringVisualizationData> {
        return this.visualizationApi.getRadarChartData(trainingDefinitionId, numOfClusters, instanceIds, level).pipe(
            map((data: any) => RadarChartDataMapper.fromDTO(data)),
            catchError((error) => {
                return throwError(this.messageBase + error.message);
            }),
        );
    }

    getLineData(
        trainingDefinitionId: number,
        numOfClusters: number,
        instanceIds: number[],
        level: number,
    ): Observable<any> {
        switch (this._selectedFeature) {
            case Clusterables.WrongFlags:
                return this.visualizationApi
                    .getFeatureSSE(trainingDefinitionId, 'wrong-answers', numOfClusters, instanceIds, level)
                    .pipe(
                        map((data: any) => SseDataMapper.fromDTO(data)),
                        catchError((error) => {
                            return throwError(this.messageBase + error.message);
                        }),
                    );
            case Clusterables.TimeAfterHint:
                return this.visualizationApi
                    .getFeatureSSE(trainingDefinitionId, 'hints', numOfClusters, instanceIds, level)
                    .pipe(
                        map((data: any) => SseDataMapper.fromDTO(data)),
                        catchError((error) => {
                            return throwError(this.messageBase + error.message);
                        }),
                    );
            case Clusterables.NDimensional:
                return this.visualizationApi
                    .getFeatureSSE(trainingDefinitionId, 'n-dimensional', numOfClusters, instanceIds, level)
                    .pipe(
                        map((data: any) => SseDataMapper.fromDTO(data)),
                        catchError((error) => {
                            return throwError(this.messageBase + error.message);
                        }),
                    );
        }
    }

    getOption(point: Clusterable, feature = this._selectedFeature): number {
        switch (feature) {
            case Clusterables.TimeAfterHint:
                return (point as TimeAfterHint).level;
        }
        return 0;
    }

    getX(value: any, feature = this._selectedFeature): number {
        switch (feature) {
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

    getY(value: any, feature = this._selectedFeature): number {
        switch (feature) {
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

    getXLabel(feature = this._selectedFeature): string {
        switch (feature) {
            case Clusterables.WrongFlags:
                return 'Wrong answers submitted';
            case Clusterables.TimeAfterHint:
                return 'Time spent after using hint';
        }
        return 'Feature X';
    }

    getYLabel(feature = this._selectedFeature): string {
        switch (feature) {
            case Clusterables.WrongFlags:
                return 'Time played';
            case Clusterables.TimeAfterHint:
                return 'Wrong answers after using hint';
        }
        return 'Feature Y';
    }
}
