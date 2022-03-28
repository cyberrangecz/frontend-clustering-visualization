import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription, throwError, timer} from 'rxjs';
import {VisualizationData} from '../../models/visualization-data';
import {VisualizationsDataService} from '../../services/visualizations-data.service';
import {Clusterables} from "../../models/clusterables-enum";
import {Components} from "../../models/components-enum";

@Component({
  selector: 'kypo-clustering-visualization',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.css']
})
export class VisualizationsComponent implements OnInit, OnChanges {

  @Input() trainingDefinitionId: number;
  @Input() trainingInstanceId: number;
  @Input() numOfClusters: number;
  @Input() isStandalone: boolean;
  @Input() selectedComponent: Components = Components.SCATTER;
  @Input() selectedFeature: Clusterables = Clusterables.WrongFlags;

  private requestedFeature: Clusterables;

  lineData$: Observable<VisualizationData>;
  visualizationData$: Observable<VisualizationData>;
  radarChartData$: Observable<VisualizationData>;

  constructor(
    private visualizationDataService: VisualizationsDataService
  ) {}

  ngOnInit() {
    this.requestedFeature = this.selectedFeature;
    this.loadData();
  }

  ngOnChanges() {
    //console.log(this.trainingDefinitionId);
    //if (this.requestedFeature != this.selectedFeature || ) {
      this.loadData();
      this.requestedFeature = this.selectedFeature;
    //}
  }

  private loadData() {
    this.visualizationDataService.selectedFeature = this.selectedFeature;

    const lineService = this.visualizationDataService.getLineData(this.trainingDefinitionId, this.numOfClusters);
    lineService.subscribe((res) => {
      this.lineData$ = res;
    });
    if (this.selectedFeature == 0 || this.selectedFeature == 1) {
      const scatterService = this.visualizationDataService.getData(this.trainingDefinitionId, this.numOfClusters);
      scatterService.subscribe((res) => {
        this.visualizationData$ = res;
      });
    }
    if (this.selectedFeature == 2) {
      const radarService = this.visualizationDataService.getRadarData(this.trainingDefinitionId, this.numOfClusters);
      radarService.subscribe((res) => {
        this.radarChartData$ = res;
      });
    }
  }
}
