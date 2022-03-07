import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import {VisualizationData} from "../models/visualization-data";
import {Clusterables} from "../models/clusterables-enum";

export abstract class VisualizationsDataService {

  protected visualizationDataSubject$: ReplaySubject<VisualizationData> = new ReplaySubject();

  visualizationData$: Observable<VisualizationData> = this.visualizationDataSubject$
    .asObservable()
    .pipe(filter((vd) => vd !== undefined && vd !== null));

  abstract set selectedFeature(value: Clusterables);

  abstract getData(trainingInstanceId: number)/*: Observable<VisualizationData>*/;

  abstract getRadarData(trainingInstanceId: number);

  abstract getLineData(trainingInstanceId: number, numOfClusters: number);
}
