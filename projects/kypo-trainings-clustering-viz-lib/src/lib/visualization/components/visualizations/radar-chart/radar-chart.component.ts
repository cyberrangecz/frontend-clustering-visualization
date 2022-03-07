import { AfterViewInit, Component, Input, OnChanges, ViewEncapsulation,} from '@angular/core';
import { D3, D3Service } from '@muni-kypo-crp/d3-service';
import { BaseConfig } from '../../../models/base-config';
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
  @Input() isStandalone: boolean;

  private readonly d3: D3;
  private readonly radialScale;
  private readonly smallScale;
  private chartArea;
  private features: string[];
  private featureTooltips: string[];
  private svg: any;
  private smallSvgs: any[] = [];
  private gPlot: any;

  private wrapperWidth: number;
  private wrapperHeight: number;
  private width: number = 450;
  private height: number = 400;
  private tooltip: any;

  public numOfClusters = 6;
  public trainingDefinitionId: number = 25;
  public errorMessage: string = null;
  public showInfo: boolean;

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
    this.drawChartBase({
          element: 'main-radar',
          padding: {
            top: 10,
            bottom: 40
          }
        }
    );
  }

  drawChart(): void {
    this.clearSelection('#radar-chart');
    this.clearSelection('#small-radar-charts');
    this.createTooltip();
    this.createChart();
    this.createSmallCharts();
  }

  createSmallCharts(data: EuclidianDoublePoint[] = this.visualizationData.radarData) {
    let radialScaleSmall = this.smallScale;

    data.forEach((cluster, i) => {
      let smallChartsSvg = this.d3.select("#small-radar-charts").append("svg")
          .attr("viewBox", "090 60 200 200")
          .attr("width", 240)
          .attr("height", 200)
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
              .attr("stroke-width", "1.2")
              .attr("stroke", "lightGray")
              .attr("r", radialScaleSmall(t))
      );

      for (let i = 0; i < this.features.length; i++) {
        let ft_name = this.features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
        let line_coordinate = this.angleToCoordinate(angle, 3, radialScaleSmall);
        let label_coordinate = this.angleToCoordinate(angle, 3.6, radialScaleSmall);

        //draw axis line
        smallChartsClipPath.append("line")
            .attr("x1", 190)
            .attr("y1", 190)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke-width", "0.8")
            .attr("stroke", "gray");

        //draw axis label
        smallChartsClipPath.append("text")
            .attr("x", label_coordinate.x)
            .attr("y", label_coordinate.y)
            .attr("text-anchor", "middle")
            .style("font-size","14")
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
          .attr("stroke-width", 1)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("stroke-opacity", 1)
          .attr("fill-opacity", 0.5);
    });
  }

  createChart(data: EuclidianDoublePoint[] = this.visualizationData.radarData) {
    const d3: D3 = this.d3,
        radarOpacity: number = this.appConfig.radarClusterOpacity;

    this.svg = d3.select("#radar-chart").append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", this.width/6 + " " + this.height/6 + " " + this.width/1.8 + " " + this.height/1.8)
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
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0);

    // radar circles
    let ticks = [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
    ticks.forEach(t =>
        this.gPlot.append("circle")
            .attr("cx", 190)
            .attr("cy", 190)
            .attr("fill", "none")
            .attr("stroke", "#919191")
            .attr("stroke-width", "0.5")
            .attr("r", this.radialScale(t))
    );

    let tooltip = this.tooltip;

    for (let i = 0; i < this.features.length; i++) {
      let ft_name = this.features[i];
      let ft_tooltip = this.featureTooltips[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      let line_coordinate = this.angleToCoordinate(angle, 3, this.radialScale);
      let label_coordinate = this.angleToCoordinate(angle, 3.6, this.radialScale);

    //draw axis line
    this.gPlot.append("line")
          .attr("x1", 190)
          .attr("y1", 190)
          .attr("x2", line_coordinate.x)
          .attr("y2", line_coordinate.y)
          .attr("stroke-width", "0.5")
          .attr("stroke", "gray");

    //draw axis label
    this.gPlot.append("text")
          .attr("id", "label"+i)
          .attr("x", label_coordinate.x)
          .attr("y", label_coordinate.y)
          .attr("text-anchor", "middle")
          .style("font-size","9")
          .text(ft_name)
          .on("mouseover", function(event, d){
            tooltip
                .transition()
                .ease(d3.easeLinear,2)
                .duration(300)
                .delay(10)
                .style('opacity', 0.9);
            tooltip
                .html(ft_tooltip)
                .style("left", (d3.pointer(event, d3.select("#radar-chart"))[0]-200) + "px")
                .style("top", (d3.pointer(event, d3.select("#radar-chart"))[1]-100) + "px")
          })
        .on("mousemove", function(event, d){
          tooltip
              .style("left", (d3.pointer(event, d3.select("#radar-chart"))[0]-200) + "px")
              .style("top", (d3.pointer(event, d3.select("#radar-chart"))[1]-100) + "px")
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
          .attr("class", "cluster")
          .attr("d", line)
          .attr("cx", 100)
          .attr("cy", 100)
          .attr("stroke-width", 1)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("stroke-opacity", 0.7)
          .attr("fill-opacity", radarOpacity)

      this.gPlot.selectAll(".cluster")
          .attr("id", (d, i) => "c-" + i)
          .attr("clusterNum", (d, i) => i)
          .on("mouseover", function(event, d) {
            const clusterSize = data[d3.select(this).attr("clusterNum")].points.length;
            tooltip
                .style("left", (d3.pointer(event, d3.select("#radar-chart"))[0]-200) + "px")
                .style("top", (d3.pointer(event, d3.select("#radar-chart"))[1]-100) + "px")
                .text("Cluster of " + clusterSize + " trainees")
                .transition("ease")
                .style('opacity', 1);

            let z = "path#" + d3.select(this).attr("id");
            d3.selectAll(".cluster")
                .transition("ease")
                .style("fill-opacity", 0.1);
            d3.select(z)
                .transition("ease")
                .style("fill-opacity", .6);
          })
          .on("mousemove", function(event) {
            tooltip
                .style("left", (d3.pointer(event, d3.select("#radar-chart"))[0]-200) + "px")
                .style("top", (d3.pointer(event, d3.select("#radar-chart"))[1]-100) + "px");
          })
          .on('mouseout', function(){
              tooltip
                  .transition("ease")
                  .style('opacity', 0);
              d3.selectAll(".cluster")
                  .transition("ease")
                  .style("fill-opacity", radarOpacity);
          })
    }
  }

  /**
   * A tooltip to clarify the labels
   */
  createTooltip() {
    if (typeof this.tooltip !== 'undefined') this.tooltip.remove();

    this.tooltip = this.d3
        .select('#radar-chart')
        .append('div')
        .attr('class', 'clustering-radar-tooltip')
        .style("opacity", "0");
  }

  angleToCoordinate(angle: number, value: number, radialScale: any) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": 190 + x, "y": 190 - y};
  }

  /**
   * Computes all 2D coordinates of each cluster
   * @param data_point the coordinates
   * @param radialScale scale to which coordinate adapts
   */
  getPathCoordinates(data_point: Point, radialScale: any) {
    let coordinates = [];
    // to close the path
    let lastCoordinate = {};
    for (let i = 0; i < this.features.length; i++) {
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      let newCoordinate = this.angleToCoordinate(angle, data_point.point[i], radialScale);
      lastCoordinate = (i === 0) ? newCoordinate : lastCoordinate;
      coordinates.push(newCoordinate);
    }
    coordinates.push(lastCoordinate);
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
    const d3: D3 = this.d3,
    padding = baseConfig.padding,
    element = baseConfig.element;

    // create svg
    // calculate the height first, width can change when the scrollbar is added
    this.wrapperWidth = Math.max(
      document.getElementById(element)?.getBoundingClientRect().width, // original (standalone) size
      window.innerWidth - (window.innerWidth) * 0.37
    ); // get width in the dashboard as a 75% piece of a halfpage
    const maxHeight: number = Math.min(
      this.wrapperWidth * 0.7,
      window.innerHeight - 130
    );
    const minHeight: number = 400;
    this.wrapperHeight = Math.max(maxHeight, minHeight);

    this.chartArea = d3
      .select('#' + element)
      .attr('height', this.wrapperHeight)
      .attr('width', this.wrapperWidth)
      .attr('style', 'padding: 10px 15px')
  }

  /**
   * Clear the specified HTML when needed (e.g., resize)
   */
  clearSelection(selection: string): void {
    this.d3.select(selection).html('');
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  onResize() {
    this.drawChart();
  }
}
