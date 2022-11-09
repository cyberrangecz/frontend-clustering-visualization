import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription, throwError, timer} from 'rxjs';
import {VisualizationData} from '../../models/visualization-data';
import {VisualizationsDataService} from '../../services/visualizations-data.service';
import {Clusterables} from "../../models/clusterables-enum";
import {Components} from "../../models/components-enum";
import {RadarChartComponent} from "./radar-chart/radar-chart.component";

@Component({
  selector: 'kypo-clustering-visualization',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.css']
})
export class VisualizationsComponent implements OnInit, OnChanges {

  @Input() level: number;
  @Input() trainingDefinitionId: number;
  @Input() trainingInstanceIds: number[];
  @Input() numOfClusters: number;
  @Input() isStandalone: boolean;
  @Input() selectedComponent: Components = Components.SCATTER;
  @Input() selectedFeature: Clusterables = Clusterables.WrongFlags; // (wf 1, tah 2, nd 3)

  @Output() viewOpen: EventEmitter<boolean> = new EventEmitter();

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

  toggleView(showView: boolean) {
    this.viewOpen.emit(showView);
  }

  private loadData() {
    this.visualizationDataService.selectedFeature = this.selectedFeature;

    const lineService = this.visualizationDataService.getLineData(this.trainingDefinitionId, this.elbowNumClusters, this.trainingInstanceIds, this.level);
    lineService.subscribe((res) => {
      this.lineData$ = res;
    });
    if (this.selectedFeature == 0 || this.selectedFeature == 1) {
      const scatterService = this.visualizationDataService.getData(this.trainingDefinitionId, this.numOfClusters, this.trainingInstanceIds, this.level);
      scatterService.subscribe((res) => {
        this.visualizationData$ = res;
      });
    }
    if (this.selectedFeature == 2) {
      const radarService = this.visualizationDataService.getRadarData(this.trainingDefinitionId, this.numOfClusters, this.trainingInstanceIds, this.level);
      radarService.subscribe((res) => {
        this.radarChartData$ = res;
      });
    }
  }
}
