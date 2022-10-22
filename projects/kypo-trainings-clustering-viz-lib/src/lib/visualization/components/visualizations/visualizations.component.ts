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

  @Input() level: string = "";
  @Input() trainingDefinitionId: number;
  @Input() trainingInstanceId: number;
  @Input() numOfClusters: number;
  @Input() isStandalone: boolean;
  @Input() selectedComponent: Components = Components.SCATTER;
  @Input() selectedFeature: Clusterables = 2;//Clusterables.WrongFlags; // (wf 1, tah 2, nd 3)

  elbowNumClusters: number = 15; // this ensures we dont load data after every linechart change (15 clusters should be more than enough)
  lineData$: Observable<VisualizationData>;
  visualizationData$: Observable<VisualizationData>;
  radarChartData$: Observable<VisualizationData>;

  constructor(
    private visualizationDataService: VisualizationsDataService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  private loadData() {
    this.visualizationDataService.selectedFeature = this.selectedFeature;

    const lineService = this.visualizationDataService.getLineData(this.trainingDefinitionId, this.elbowNumClusters, this.level);
    lineService.subscribe((res) => {
      this.lineData$ = res;
    });
    if (this.selectedFeature == 0 || this.selectedFeature == 1) {
      const scatterService = this.visualizationDataService.getData(this.trainingDefinitionId, this.numOfClusters, this.level);
      scatterService.subscribe((res) => {
        this.visualizationData$ = res;
      });
    }
    if (this.selectedFeature == 2) {
      const radarService = this.visualizationDataService.getRadarData(this.trainingDefinitionId, this.numOfClusters, this.level);
      radarService.subscribe((res) => {
        this.radarChartData$ = res;
      });
    }
  }
}
