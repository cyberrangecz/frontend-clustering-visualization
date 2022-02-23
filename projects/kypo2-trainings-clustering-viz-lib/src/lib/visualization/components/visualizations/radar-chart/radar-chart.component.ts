import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Axis, D3, D3Service, ScaleBand, ScaleLinear } from '@muni-kypo-crp/d3-service';
import { BaseConfig } from '../../../models/base-config';
import { Padding } from '../../../models/padding';
import { AppConfig } from '../../../../app.config';
import { GenericObject } from '../../../models/generic-object.type';
import { ConfigService } from '../../../config/config.service';
import { Subscription } from 'rxjs';
import { TrainingDataEntry } from '../../../models/training-data-entry';
import { Player } from '../../../models/player';

@Component({
  selector: 'kypo2-viz-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RadarChartComponent implements OnChanges, OnDestroy, AfterViewInit {


 // @Input() visualizationData: VisualizationData;

  /*@Input() view = this.appConfig.defaultView;
  @Input() selectedPlayerView: PlayerView = PlayerView.Both;

  @Input() colorScheme: string[];
  @Input() eventService: TrainingAnalysisEventService;
  @Input() setDashboardView = false;
  @Input() externalFilters;
  @Input() trainingColors = this.appConfig.trainingColors;
  @Input() playerColorScheme: string[];
  @Input() trainingInstanceId: number;

  @Input() selectedPlayers: Player[];
  @Output() outputSelectedPlayers = new EventEmitter<number[]>();
  @Output() highlightedPlayer = new EventEmitter<number>();*/

  private wrapperWidth: number;
  private wrapperHeight: number;
  private width: number;
  private height: number;
  private padding: Padding;
  private bounds: any;
  private outerWrapper: any;

  private readonly d3: D3;
  private chart: any;
  private plan: any;
  public xScale: ScaleLinear<number, number>;
  private yScale: ScaleBand<string>;
  private xAxis: Axis<number | { valueOf(): number }>;
  private tooltip: any;
  private trainingDataSet: TrainingDataEntry[] = [];
  private planDataSet: GenericObject[] = [];

  public time = 0;
  public startTime = 0;
  public participants;

  public hasData;
  public errorMessage: string = null;

  constructor(
    d3Service: D3Service,
    private configService: ConfigService,
    private appConfig: AppConfig,
  ) {
    this.d3 = d3Service.getD3();
  }

  ngOnChanges(): void {
    //this.configService.trainingColors = this.trainingColors;
    this.setData();
  }

  ngAfterViewInit(): void  {
    this.setData()
    this.initializeZoom();
  }

  setData(){

    this.drawChart();
  }

  drawChart(): void {
    /*const data: PreparedData = this.getPreparedData();
    this.applyData(data.trainingDataSet, data.planDataSet);
    this.pan();*/
  }

  initializeZoom(): void {
    /*if (this.view === View.Overview) {
      // in the case of overview mode, we initially want to see only the player progress, not the whole training plan
      this.overviewZoomValue =
        this.view === View.Overview
          ? Math.max(
            // but we don't want the zooming to be extreme
            Math.min(
              this.appConfig.maxZoomValue,
              this.xScale(this.planDomain) / this.xScale(this.time)), 1)
          : this.zoomValue;
      this.zoomValue = this.overviewZoomValue;
    } else if (this.view === View.Progress) {
      this.zoomValue = this.progressZoomValue;
    }*/
  }

  drawChartBase(baseConfig: BaseConfig): void {
    /*const d3: D3 = this.d3,
      element: string = baseConfig.element,
      planData: PlanData = baseConfig.data,
      padding: Padding = baseConfig.padding,
      estimatedTime: number = baseConfig.estimatedTime,
      stack = d3
        .stack()
        .keys(planData.keys)
        .offset(d3.stackOffsetNone),
      layers = stack(planData.teams);
    this.time = baseConfig.time;
    this.padding = padding;

    // clear wrapper content
    d3.select('#' + element).html('');
    this.outerWrapper = d3.select('.' + baseConfig.outerWrapperElement);
    // create svg
    // calculate the height first, width can change when the scrollbar is added
    this.wrapperWidth = Math.max(
      document.getElementById(element)?.getBoundingClientRect().width, // original (standalone) size
      window.innerWidth - (window.innerWidth) * 0.37
    ); // get width in the dashboard as a 75% piece of a halfpage
    const maxHeight: number = Math.min(
      this.wrapperWidth * 0.7,
      window.innerHeight - 130,
      baseConfig.maxBarHeight * planData.teams.length
    );
    const minHeight: number =
      baseConfig.minBarHeight * planData.teams.length + 80;
    this.wrapperHeight = Math.max(maxHeight, minHeight);

    this.chart = d3
      .select('#' + element)
      .append('svg')
      .attr('class', 'ctf-progress-chart')
      .attr('height', this.wrapperHeight)
      .attr('width', this.wrapperWidth)
      .attr('transform', 'translate(0, ' + padding.top + ')');

    this.width = this.wrapperWidth * this.zoomValue;
    this.height = this.wrapperHeight - padding.top - padding.bottom;

    this.planDomain = Math.max(
      estimatedTime,
      d3.max(layers[layers.length - 1], (d: number[]): number => {
        return d[1];
      })
    );

    this.initializeScales(planData);
    this.createAxis(estimatedTime, baseConfig.time);*/
  }

  onResize() {
    this.drawChart();
  }

  ngOnDestroy() {
   /* if (this._activeDataSubscribtion) {
      this._activeDataSubscribtion.unsubscribe();
    }
    if (this._updateVisSubscribtion) {
      this._updateVisSubscribtion.unsubscribe();
    }
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.highlightSubscription) {
      this.highlightSubscription.unsubscribe();
    }*/
  }
}
