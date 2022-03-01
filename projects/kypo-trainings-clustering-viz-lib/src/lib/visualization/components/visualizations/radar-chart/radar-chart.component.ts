import { AfterViewInit, Component, Input, OnChanges, OnDestroy, ViewEncapsulation,} from '@angular/core';
import { Axis, D3, D3Service, ScaleBand, ScaleLinear } from '@muni-kypo-crp/d3-service';
import { BaseConfig } from '../../../models/base-config';
import { Padding } from '../../../models/padding';
import { AppConfig } from '../../../../app.config';
import { ConfigService } from '../../../config/config.service';
import { Subscription } from 'rxjs';
import {VisualizationData} from "../../../models/visualization-data";
import {EuclidianDoublePoint, Point} from "../../../models/eucledian-double-point";

@Component({
  selector: 'kypo-viz-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RadarChartComponent implements OnChanges, AfterViewInit {

  @Input() visualizationData: VisualizationData;

  private readonly d3: D3;
  private readonly radialScale;
  private readonly smallScale;
  private features: string[];
  private featureTooltips: string[];
  private svg: any;
  private smallSvgs: any[] = [];
  private gPlot: any;

  private wrapperWidth: number;
  private wrapperHeight: number;
  private width: number = 450;
  private height: number = 400;
  private padding: Padding;
  private bounds: any;
  private outerWrapper: any;
  public xScale: ScaleLinear<number, number>;
  private yScale: ScaleBand<string>;
  private tooltip: any;

  public numOfClusters = 6;
  public trainingDefinitionId: number = 25;
  public errorMessage: string = null;

  constructor(
    d3Service: D3Service,
    private configService: ConfigService,
    private appConfig: AppConfig,
  ) {
    this.d3 = d3Service.getD3();
    this.radialScale = this.d3.scaleLinear()
        .domain(appConfig.radialScaleDomain)
        .range(appConfig.radialScaleRange);
    this.smallScale = this.d3.scaleLinear()
        .domain(appConfig.radialScaleDomain)
        .range([0, 80]);
  }

  ngOnChanges(): void {
    if (this.visualizationData != undefined) {
      this.drawChart();
    }
  }

  ngAfterViewInit(): void  {
    this.features = this.appConfig.features;
    this.featureTooltips = this.appConfig.featureTooltips;
  }

  drawChart(): void {
    this.createTooltip();
    this.createChart();
    this.createSmallCharts();
  }

  createSmallCharts(data: EuclidianDoublePoint[] = this.visualizationData.radarData) {
    let radialScaleSmall = this.smallScale;

    //clear small charts content
    this.d3.select('#small-radar-charts').html('');

    data.forEach((cluster, i) => {
      let smallChartsSvg = this.d3.select("#small-radar-charts").append("svg")
          .attr("viewBox", "0 0 300 300")
          .attr("width", 300)
          .attr("height", 300)
          .attr("preserveAspectRatio", "xMidYMid meet");
      this.smallSvgs.push(smallChartsSvg);

      let clip = smallChartsSvg.append("defs").append("SVG:clipPath")
          .attr("id", "clip")
          .append("SVG:rect")
          .attr("width", 200)
          .attr("height", 200)
          .attr("x", 0)
          .attr("y", 0);

      let smallChartsClipPath = smallChartsSvg
          .append("g")
          .attr("clip-path", "url(#clip)")

     smallChartsClipPath.append("text")
          .text("Cluster with n="+ cluster.points.length)
          .attr("x", 120)
          .attr("y", 80)
          .style("font-weight", "bold");
      let ticks = [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
      ticks.forEach(t =>
          smallChartsClipPath.append("circle")
              .attr("cx", 190)
              .attr("cy", 190)
              .attr("fill", "none")
              .attr("stroke", "gray")
              .attr("r", radialScaleSmall(t))
      );

      for (let i = 0; i < this.features.length; i++) {
        let ft_name = this.features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
        let line_coordinate = this.angleToCoordinate(angle, 3.2, radialScaleSmall);
        let label_coordinate = this.angleToCoordinate(angle, 3.6, radialScaleSmall);

        //draw axis line
        smallChartsClipPath.append("line")
            .attr("x1", 190)
            .attr("y1", 190)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke", "black");

        //draw axis label
        smallChartsClipPath.append("text")
            .attr("x", label_coordinate.x)
            .attr("y", label_coordinate.y)
            .attr("text-anchor", "middle")
            .text(ft_name);
      }

      let line = this.d3.line<{ x: number, y: number }>()
          .x(d => d.x)
          .y(d => d.y);

      let d = cluster;
      let color = this.appConfig.colors[i];
      let coordinates = this.getPathCoordinates(d.center, radialScaleSmall);

      //draw the path element
      smallChartsClipPath.append("path")
          .datum(coordinates)
          .attr("d", line)
          .attr("stroke-width", 3)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("stroke-opacity", 1)
          .attr("opacity", 0.5);
    });
  }

  createChart(data: EuclidianDoublePoint[] = this.visualizationData.radarData) {
    const d3: D3 = this.d3;

    //clear main chart content
    this.d3.select('#radar-chart').html('');

    this.svg = d3.select("#radar-chart").append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", this.width/6 + " " + this.height/6 + " " + this.width/2 + " " + this.height/2)
        .attr("preserveAspectRatio", "xMidYMid meet");

    let clip = this.svg.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0);

    this.gPlot = this.svg
        .append("g")
        .attr("clip-path", "url(#clip)")

    let ticks = [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
    ticks.forEach(t =>
        this.gPlot.append("circle")
            .attr("cx", 190)
            .attr("cy", 190)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", this.radialScale(t))
    );

    for (let i = 0; i < this.features.length; i++) {
      let ft_name = this.features[i];
      let ft_tooltip = this.featureTooltips[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      let line_coordinate = this.angleToCoordinate(angle, 3.2, this.radialScale);
      let label_coordinate = this.angleToCoordinate(angle, 3.6, this.radialScale);

      //draw axis line
      this.gPlot.append("line")
          .attr("x1", 190)
          .attr("y1", 190)
          .attr("x2", line_coordinate.x)
          .attr("y2", line_coordinate.y)
          .attr("stroke", "black");

      let tooltip = this.tooltip;

      //draw axis label
      this.gPlot.append("text")
          .attr("id", "label"+i)
          .attr("x", label_coordinate.x)
          .attr("y", label_coordinate.y)
          .attr("text-anchor", "middle")
          .style("font-size","8")
          .text(ft_name)
          .on("mouseover", function(event){
            tooltip
                .transition()
                .ease(d3.easeLinear,2)
                .duration(300)
                .delay(10)
                .style('opacity', 0.9);
            tooltip
                .html(ft_tooltip)
                .style("left", (d3.pointer(event, d3.select("#radar-chart"))[0]+20) + "px")
                .style("top", (d3.pointer(event, d3.select("#radar-chart"))[1]-30) + "px")
          })
          .on("mouseout", function(){
            tooltip
                .transition()
                .duration(0)
                .style('opacity', 0);
          });

    }

    let line = d3.line<{ x: number, y: number }>()
        .x(d => d.x)
        .y(d => d.y);

    for (let i = 0; i < data.length; i++) {
      let d = data[i];
      let color = this.appConfig.colors[i];
      let coordinates = this.getPathCoordinates(d.center, this.radialScale);

      //draw the path element
      this.gPlot.append("path")
          .datum(coordinates)
          .attr("d", line)
          .attr("stroke-width", 3)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("stroke-opacity", 1)
          .attr("opacity", 0.5);
    }
  }

  createTooltip() {
    if (typeof this.tooltip !== 'undefined') this.tooltip.remove();

    this.tooltip = this.d3
        .select('#radar-chart')
        .append('div')
        .attr('class', 'clustering-radar-tooltip')
        .style('opacity', 0);
  }


  angleToCoordinate(angle: number, value: number, radialScale: any) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": 190 + x, "y": 190 - y};
  }

  getPathCoordinates(data_point: Point, radialScale: any) {
    let coordinates = [];
    for (let i = 0; i < this.features.length; i++) {
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      coordinates.push(this.angleToCoordinate(angle, data_point.point[i], radialScale));
    }
    return coordinates;
  }

  clear() {
    this.svg.remove();
    if (this.smallSvgs != undefined) {
      for (let svg of this.smallSvgs) {
        svg.remove();
      }
    }
  }

  drawChartBase(baseConfig: BaseConfig): void {
    /*const d3: D3 = this.d3
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

    this.width = this.wrapperWidth;
    this.height = this.wrapperHeight - padding.top - padding.bottom;*/
  }

  onResize() {
    this.drawChart();
  }
}
