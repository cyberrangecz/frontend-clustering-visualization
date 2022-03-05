import {Injectable} from "@angular/core";
//import {RestService} from "./rest.service";
//import {Cluster, Clusterable, Clusterables, EventIdentification, WrongFlags, TimeAfterHint} from "../model/feature.model";
import {Observable} from "rxjs";
import {Clusterables} from "../models/clusterables-enum";
import {WrongFlags} from "../models/wrong-flags";
import {Clusterable} from "../models/clusterable";
import {EventIdentification} from "../models/event-identification";
import {ClusterVisualizationData} from "../models/cluster-visualization-data";
import {TimeAfterHint} from "../models/time-after-hint";

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

    set selectedFeature(value: Clusterables) {
    this._selectedFeature = value;
  }
  private _selectedFeature: Clusterables; //|undefined;

  /*constructor(private restService: RestService) {
  }*/

  getDataScatter(event: EventIdentification, numOfClusters: number): Observable<ClusterVisualizationData<any>[]> {
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

  getDataLine(eventId: EventIdentification, numOfClusters: number): Observable<number[]> {
    switch (this._selectedFeature) {
      case Clusterables.WrongFlags:
        return null; //this.restService.getFeatureOneSSE(eventId, numOfClusters);
      case Clusterables.TimeAfterHint:
        return null; //this.restService.getFeatureTwoSSE(eventId, numOfClusters);
      case Clusterables.NDimensional:
        return null; //this.restService.getNDimensionalSSE(eventId, numOfClusters);
    }
    return null; //this.restService.getFeatureOneSSE(eventId, numOfClusters);
  }

  getXLabel(): string {
    switch (this._selectedFeature) {
      case Clusterables.WrongFlags:
        return "Wrong flags";
      case Clusterables.TimeAfterHint:
        return "Time spent after using hint";
    }
    return "";
  }

  getYLabel(): string {
    switch (this._selectedFeature) {
      case Clusterables.WrongFlags:
        return "Time played";
      case Clusterables.TimeAfterHint:
        return "Wrong flags after using hint";
    }
    return "";
  }

  static getEventIdentification(trainingDefinitionId: number): EventIdentification {
    let res = new EventIdentification();
    res.trainingDefinitionId = trainingDefinitionId != null ? trainingDefinitionId.toString() : '';
    return res;
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
  }

  getOption(point: Clusterable): number {
    switch (this._selectedFeature) {
      case Clusterables.TimeAfterHint:
        return (point as TimeAfterHint).level;
    }
    return 0;
  }
}
