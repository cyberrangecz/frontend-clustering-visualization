import {Component, Input, OnInit} from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, throwError, timer } from 'rxjs';;
import { VisualizationDataDTO } from '../../DTOs/visualization-data-dto';
import { VisualizationData } from '../../models/visualization-data';
import { VisualizationsDataService } from '../../services/visualizations-data.service';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'kypo-clustering-visualization',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.css']
})
export class VisualizationsComponent implements OnInit {

 /* @Input() trainingDefinitionId: number;*/
  @Input() trainingInstanceId: number = 25;
  @Input() JSONData: VisualizationDataDTO;

  @Input() isStandalone: boolean;

  visualizationData$: Observable<VisualizationData>;
  radarChartData$: Observable<VisualizationData>;

  private isAlive = true;

  constructor(
    private visualizationDataService: VisualizationsDataService,
    private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const service = this.visualizationDataService.getData(this.trainingInstanceId);
    service.subscribe((res) => {
      this.visualizationData$ = res;
    });
    const radarService = this.visualizationDataService.getRadarData(this.trainingInstanceId);
    radarService.subscribe((res) => {
      this.radarChartData$ = res;
    })
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
