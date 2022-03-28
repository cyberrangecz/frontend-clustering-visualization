import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Clusterables} from "../models/clusterables-enum";
import {Clusterable} from "../models/clusterable";
import {EventIdentification} from "../models/event-identification";
import {ClusterVisualizationData} from "../models/cluster-visualization-data";
import {TimeAfterHint} from "../models/time-after-hint";

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  private _selectedFeature: Clusterables;

 /* getDataScatter(event: EventIdentification, numOfClusters: number): Observable<ClusterVisualizationData[]> {
    switch (this._selectedFeature) {
      case Clusterables.WrongFlags:
        return null;//this.restService.getFeatureOneClusters(event, numOfClusters);
      case Clusterables.TimeAfterHint:
        return null;//this.restService.getFeatureTwoClusters(event, numOfClusters);
      case Clusterables.NDimensional:
        break;
    }
    return null; //this.restService.getFeatureOneClusters(event, numOfClusters);
  }

  filterPoints(options: Map<number, boolean>, point: Clusterable): string {
    switch (this._selectedFeature) {
      case Clusterables.TimeAfterHint:
        return this.filterLevels(options, point);
    }
    return "visible";
  }

  filterLevels(options: Map<number, boolean>, point: Clusterable): string {
    return options.get((point as TimeAfterHint).level) ? "visible" : "hidden";
  }*/
}
