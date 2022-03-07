import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {D3, D3Service} from "@muni-kypo-crp/d3-service";
import {ConfigService} from "../../../config/config.service";
import {AppConfig} from "../../../../app.config";
import {SseData} from "../../../models/sse-data";

@Component({
  selector: 'kypo-viz-clustering-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges {

  @Input() visualizationData: number[] = []; //SseData = [];
  @Input() trainingDefinitionId: number;
  @Input() trainingInstanceId: number;
  @Input() numOfClusters: number;

  private readonly d3: D3;
  private gChart: any;
  private svg: any;
  private height: number = 450;
  private width: number = 910;
  private margin: number = 25;
  private x: any;
  private y: any;
  private xAxis: any;
  private yAxis: any;

  constructor(d3Service: D3Service,
              private configService: ConfigService,
              private appConfig: AppConfig) {
    this.d3 = d3Service.getD3();
  }

  ngOnChanges(): void {
    if (this.visualizationData != undefined) {
      this.createChart();
    }
  }

  createChart(): void {
      if (this.gChart != undefined) {
        this.clear();
      }
      this.createSvg();
      this.drawPlot();
  }

  private createSvg(): void {
    this.svg = this.d3.select("#chartDiv")
        .append("svg")
        .attr("viewBox", "-50 0 1500 550")
        .attr("preserveAspectRatio", "xMidYMid meet")
    this.gChart = this.svg
        .append("g")
        .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawPlot(): void {
    const d3: D3 = this.d3,
    // slicing data to make sure we have a line with specified number of clusters
    data = this.visualizationData.slice(0, this.numOfClusters);

    // Add X axis
    this.x = d3.scaleLinear()
        .domain([1, this.numOfClusters])
        .rangeRound([0, this.width]);
    this.xAxis = this.gChart.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x).ticks(this.numOfClusters));
    this.gChart.append("text")
        .attr("transform", "translate(" + this.width / 2 + "," + (this.height + 2 * this.margin) + ")")
        .text("Number of clusters");

    // Add Y axis
    this.y = d3.scaleLinear()
        .domain(d3.extent(data) as [number, number])
        .range([this.height, 0])
        .nice();

    this.yAxis = this.gChart.append("g")
        .call(d3.axisLeft(this.y));
    this.gChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.margin * 2)
        .attr("x", 0 - this.height / 2 - this.margin)
        .text("Sum of squared errors");


    // add the line connecting all data points
    this.svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("transform", "translate(" + this.margin + "," + this.margin + ")")
        .attr("d", d3.line()
                  .x((d, index) => this.x(index + 1))
                  .y(d => this.y(d))
        );

    // Add the dots
    this.gChart.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d: number, index: number) => this.x(index + 1))
        .attr("cy", (d: number) => this.y(d))
        .attr("r", 7)
        .style("opacity", .5)
        .attr("fill", "red");
  }

  private clear() {
    this.svg.remove();
  }
}
