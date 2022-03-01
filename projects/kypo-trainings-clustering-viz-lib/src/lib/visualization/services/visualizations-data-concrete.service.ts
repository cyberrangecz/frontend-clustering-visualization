import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VisualizationDataApi } from '../api/visualization-data-api.service';
import { VisualizationData } from '../models/visualization-data';
import { VisualizationsDataService } from './visualizations-data.service';
import {VisualizationDataMapper} from "../mappers/visualization-data-mapper";

@Injectable()
export class VisualizationsDataConcreteService extends VisualizationsDataService{

    constructor(private visualizationApi: VisualizationDataApi) {
      super();
    }

    getData(trainingInstanceId: number): Observable<VisualizationData> {
        return this.visualizationApi.getVisualizationData(trainingInstanceId).pipe(
            map((data: any) => VisualizationDataMapper.fromDTO(data)),
            catchError((error) => {
                return throwError('VisualizationsDataService not connect to API: ' + error.message);
            })
        );

    }
}
