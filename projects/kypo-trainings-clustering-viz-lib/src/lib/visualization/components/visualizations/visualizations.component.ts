import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, throwError, timer } from 'rxjs';
import { VisualizationData } from '../../models/visualization-data';
import { VisualizationsDataService } from '../../services/visualizations-data.service';
import { Clusterables } from '../../models/clusterables-enum';
import { Components } from '../../models/components-enum';

@Component({
  selector: 'kypo-clustering-visualization',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.css'],
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
  @Output() chartIsHidden: EventEmitter<boolean> = new EventEmitter();

  hideChart = false;
  elbowNumClusters = 15; // this ensures we don't load different data after every line chart change (15 clusters should be just enough)

  lineData$: Observable<VisualizationData>;
  visualizationData$: Observable<VisualizationData>;
  radarChartData$: Observable<VisualizationData>;

  constructor(private visualizationDataService: VisualizationsDataService) {}

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

    const lineService = this.visualizationDataService.getLineData(
      this.trainingDefinitionId,
      this.elbowNumClusters,
      this.trainingInstanceIds,
      this.level
    );
    lineService.subscribe((res) => {
      this.lineData$ = res;
    });
    if (this.selectedFeature == 0 || this.selectedFeature == 1) {
      const scatterService = this.visualizationDataService.getData(
        this.trainingDefinitionId,
        this.numOfClusters,
        this.trainingInstanceIds,
        this.level
      );
      scatterService.subscribe((res) => {
        this.visualizationData$ = res;
      });
    }
    if (this.selectedFeature == 2) {
      const radarService = this.visualizationDataService.getRadarData(
        this.trainingDefinitionId,
        this.numOfClusters,
        this.trainingInstanceIds,
        this.level
      );
      radarService.subscribe((res) => {
        this.radarChartData$ = res;
      });
    }
  }

  checkData(hideChart: boolean) {
    // if we don't have enough data for sse, we should hide the remaining related
    // charts as well, since they will also lack data for visualization
    this.hideChart = hideChart;
    if (hideChart) this.chartIsHidden.emit(true);
  }
}
