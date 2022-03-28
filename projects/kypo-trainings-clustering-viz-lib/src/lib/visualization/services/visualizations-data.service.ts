import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import {VisualizationData} from "../models/visualization-data";
import {Clusterables} from "../models/clusterables-enum";
import {Clusterable} from "../models/clusterable";
import {WrongFlags} from "../models/wrong-flags";
import {TimeAfterHint} from "../models/time-after-hint";

export abstract class VisualizationsDataService {

  protected visualizationDataSubject$: ReplaySubject<VisualizationData> = new ReplaySubject();

  visualizationData$: Observable<VisualizationData> = this.visualizationDataSubject$
    .asObservable()
    .pipe(filter((vd) => vd !== undefined && vd !== null));

  abstract set selectedFeature(value: Clusterables);

  abstract get selectedFeature();

  abstract getData(trainingDefinitionId: number, numOfClusters: number);

  abstract getRadarData(trainingDefinitionId: number, numOfClusters: number);

  abstract getLineData(trainingDefinitionId: number, numOfClusters: number);

  /* methods to get information based on selected feature */

  abstract getOption(point: Clusterable): number;

  abstract getX(value: any): number;

  abstract getY(value: any): number;

  abstract getXLabel(): string;

  abstract getYLabel(): string;
}
