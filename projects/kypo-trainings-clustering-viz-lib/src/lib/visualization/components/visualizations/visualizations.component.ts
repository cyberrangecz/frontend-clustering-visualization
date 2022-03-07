import {Component, Input, OnInit} from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, throwError, timer } from 'rxjs';;
import { VisualizationDataDTO } from '../../DTOs/visualization-data-dto';
import { VisualizationData } from '../../models/visualization-data';
import { VisualizationsDataService } from '../../services/visualizations-data.service';
import { AppConfig } from '../../../app.config';
import {Clusterables} from "../../models/clusterables-enum";

@Component({
  selector: 'kypo-clustering-visualization',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.css']
})
export class VisualizationsComponent implements OnInit {

  @Input() trainingDefinitionId: number;
  @Input() trainingInstanceId: number;
  @Input() numOfClusters: number;
  @Input() JSONData: VisualizationDataDTO;
  @Input() isStandalone: boolean;

  public feature: Clusterables = Clusterables.NDimensional;

  visualizationData$: Observable<VisualizationData>;
  radarChartData$: Observable<VisualizationData>;
  lineData$: Observable<VisualizationData>;

  private isAlive = true;

  constructor(
    private visualizationDataService: VisualizationsDataService,
    private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.visualizationDataService.selectedFeature = this.feature;

    const scatterService = this.visualizationDataService.getData(this.trainingInstanceId);
    scatterService.subscribe((res) => {
      this.visualizationData$ = res;
    });
    const radarService = this.visualizationDataService.getRadarData(this.trainingInstanceId);
    radarService.subscribe((res) => {
      this.radarChartData$ = res;
    });
    const lineService = this.visualizationDataService.getLineData(this.trainingInstanceId, this.numOfClusters);
    lineService.subscribe((res) => {
      this.lineData$ = res;
    })
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
