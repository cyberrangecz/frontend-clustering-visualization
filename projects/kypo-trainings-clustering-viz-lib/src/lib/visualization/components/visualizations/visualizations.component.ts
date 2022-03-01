import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, throwError, timer } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { VisualizationDataDTO } from '../../DTOs/visualization-data-dto';
import { VisualizationDataMapper } from '../../mappers/visualization-data-mapper';
import { VisualizationData } from '../../models/visualization-data';
import { VisualizationsDataService } from '../../services/visualizations-data.service';
import { AppConfig } from '../../../app.config';
import {catchError, map, take} from 'rxjs/operators';

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

  private isAlive = true;

  constructor(
    private visualizationDataService: VisualizationsDataService,
    private appConfig: AppConfig
  ) {}

  ngOnInit() {
    if(this.JSONData) {
        this.visualizationData$ = of(VisualizationDataMapper.fromDTO(this.JSONData));
    }
    else {
      this.loadData();
    }
  }

  private loadData() {
    const service = this.visualizationDataService.getData(this.trainingInstanceId);
    service.subscribe((res) => {
      this.visualizationData$ = res;
    })
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
