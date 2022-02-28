import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { filter, map, takeWhile } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';
import { VisualizationDataDTO } from '../../DTOs/visualization-data-dto';
import { VisualizationDataMapper } from '../../mappers/visualization-data-mapper';
import { VisualizationData } from '../../models/visualization-data';
import { VisualizationsDataService } from '../../services/visualizations-data.service';
import { AppConfig } from '../../../app.config';
import {Player} from "../../models/player";

@Component({
  selector: 'kypo-clustering-visualization',
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.css']
})
export class VisualizationsComponent implements OnInit, OnDestroy {

 /* @Input() trainingDefinitionId: number;
  @Input() trainingInstanceId: number;*/
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
      this.visualizationData$ = this.visualizationDataService.visualizationData$;
      //this.loadData();
      this.initUpdateSubscription();
    }
  }

  private loadData() {
    /*this.visualizationDataService
      .getData(this.trainingInstanceId)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();*/
  }

  initUpdateSubscription() {
    /*if (this.isStandalone) {
      this.loadData();
    } else {
      timer(0, this.appConfig.loadDataInterval)
          .pipe(takeWhile(() => this.isAlive))
          .subscribe(() => this.loadData())
    }*/
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

}
