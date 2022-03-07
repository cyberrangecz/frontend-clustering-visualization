import {Component, Input, OnChanges} from '@angular/core';
import {D3, D3Service} from "@muni-kypo-crp/d3-service";
import {AppConfig} from "../../../../app.config";
import {VisualizationsDataService} from "../../../services/visualizations-data.service";

@Component({
  selector: 'kypo-viz-clustering-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnChanges {

  @Input() visualizationData: {clusterData: any[]};
  @Input() trainingDefinitionId: number;
  @Input() trainingInstanceId: number;
  @Input() numOfClusters: number;

  private readonly d3: D3;
  private data: any[] = [];
  private gPlot: any;
  private margin = 60;
  private topMargin = 30;
  private width = 660;
  private height = 380;
  options: Map<number, boolean> = new Map();


  private svg: any;
  private x: d3.ScaleLinear<number, number>;
  private y: any;
  private newAllowedX;
  private newAllowedY;
  private xRef: any;
  private yRef: any;
  private xAxis: any;
  private yAxis: any;
  private dataPoints: any;
  private tooltip: any;

  constructor(d3Service: D3Service,
              private visualizationDataService: VisualizationsDataService,
              private appConfig: AppConfig) {
    this.d3 = d3Service.getD3();
  }

  ngOnChanges(): void {
    if (this.visualizationData != undefined) {
      this.createScatter();
    }
  }

  createScatter(): void {
    this.createTooltip();
    this.data = [];
    let minX, minY = Number.MAX_VALUE;
    let maxX, maxY = Number.MIN_VALUE;
    /*processedData.forEach(function(d) {
      // Normalise the values in the arrays
      const min = Math.min(d3.min(d.train), d3.min(d.test));
      const max = Math.max(d3.max(d.train), d3.max(d.test));

      d.trainNormalised = d.train.map(function(v) {
        return (v - min) / (max - min);
      });
      d.testNormalised = d.test.map(function(v) {
        return (v - min) / (max - min);
      });
    });*/

    this.visualizationData.clusterData[0].forEach((cluster, index) => {
      cluster.points.forEach(point => {
        point.clusterId = index;
        this.data.push(point);
        this.options.set(this.visualizationDataService.getOption(point), true);
      })
    });
    this.options = new Map();
    if (this.options.size == 1) { this.options.clear(); }
    if (this.gPlot != undefined) { this.clear(); }
    this.createSvg();
    this.drawPlot();
  }

  private createSvg(): void {
    this.svg = this.d3.select("#scatterDiv")
        .append("svg")
        .attr("viewBox", "0 -20 1000 500")
        .attr("preserveAspectRatio", "xMidYMid meet");

    this.svg.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", this.margin)
        .attr("y", 0);

    this.gPlot = this.svg
        .append("g")
        .attr("clip-path", "url(#clip)")
  }

  private drawPlot(): void {
    const d3: D3 = this.d3;
    // Add X axis
    this.x = d3.scaleLinear()
        .domain(d3.extent(this.data.map(value =>
            this.visualizationDataService.getX(value))) as [number, number]
        )
        .range([0, this.width - this.margin])
        .nice();

    this.xRef = this.x.copy();
    this.xAxis = this.svg.append("g")
        .attr("transform", "translate(" + this.margin + "," + (this.height /*- this.topMargin*/) + ")")
        .call(d3.axisBottom(this.x));
    this.svg.append("text")
        .attr("transform", "translate(" + this.width / 2 + "," + ( this.height + 2 * this.margin ) + ")")
        .text(this.visualizationDataService.getXLabel());

    // Add Y axis
    this.y = d3.scaleLinear()
        .domain(d3.extent(this.data.map(value =>
            this.visualizationDataService.getY(value))) as [number, number]
        )
        .range([this.height, 0])
        .nice();

    this.yRef = this.y.copy();
    this.yAxis = this.svg.append("g")
        .attr("transform", "translate(" + this.margin + ",0)")
        .call(d3.axisLeft(this.y));
    this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.margin)
        .attr("x", 0 - this.height / 2 - this.margin)
        .text(this.visualizationDataService.getYLabel());

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    let zoom = d3.zoom()
        .scaleExtent([1, 10])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [this.width, this.height]])
        .on("zoom", ((event) => this.updateChart(event)))
        .filter((event) => event.type === "mousedown" || !event.button && event.ctrlKey)

    this.svg.call(zoom)
        .on("wheel", (event) => {
          if (event.ctrlKey) {
          event.preventDefault()
        }});

    let tooltip = this.tooltip;
    console.log(tooltip);

    // Add scatter
    this.dataPoints = this.gPlot.selectAll("dot")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => this.x(this.visualizationDataService.getX(d)))
        .attr("cy", (d: any) => this.y(this.visualizationDataService.getY(d)))
        .attr("r", 7)
        .style("opacity", .5)
        .style("fill", (d: any) => this.appConfig.colors[d.clusterId])
        .on("mouseover", function(event, d){
          tooltip
              .transition()
              .ease(d3.easeLinear,2)
              .duration(300)
              .delay(10)
              .style('opacity', 0.9);
          tooltip
              .html("The trainee ID: " + d.userRefId)
              .style("left", (d3.pointer(event, d3.select("#scatterDiv"))[0]-220) + "px")
              .style("top", (d3.pointer(event, d3.select("#scatterDiv"))[1]-100) + "px")
        })
        .on("mousemove", function(event: any, d: any){
          return tooltip
              .style("left", (d3.pointer(event, d3.select("#radar-chart"))[0]-220) + "px")
              .style("top", (d3.pointer(event, d3.select("#radar-chart"))[1]-100) + "px")
        })
        .on("mouseout", function(){
          tooltip
              .transition()
              .duration(0)
              .style('opacity', 0);
        });
  }

  // A function that updates the chart when the user zoom and thus new boundaries are available
  private updateChart(event: any) {
    //event.preventDefault();
    const d3: D3 = this.d3;
    // recover the new scale
    const newX = event.transform.rescaleX(this.xRef);
    const newY = event.transform.rescaleY(this.yRef);

    // update axes with these new boundaries
    this.xAxis
        .attr("transform", "translate(" + this.margin + "," + this.height + ")")
        .call(d3.axisBottom(newX));
    this.yAxis.call(d3.axisLeft(newY));

    // update circle position
    this.gPlot
        .selectAll("circle")
        .attr("cx", (d: any) => newX(this.visualizationDataService.getX(d)) + this.margin)
        .attr("cy", (d: any) => newY(this.visualizationDataService.getY(d)));

    // update text position
    this.gPlot.selectAll("text")
        .attr("x", (d: any) => newX(this.visualizationDataService.getX(d)) + this.margin)
        .attr("y", (d: any) => newY(this.visualizationDataService.getY(d)));
  }

  createTooltip() {
    if (typeof this.tooltip !== 'undefined') this.tooltip.remove();

    this.tooltip = this.d3
        .select('#scatterDiv')
        .append('div')
        .attr('class', 'clustering-scatter-tooltip')
        .style("opacity", "0")
        .style("display", "inline-block")
        .style("position", "absolute")
        .style("padding", "5px 10px")
        .style("font-size", "10px")
        .style("opacity", "0")
        .style("background", "#5b5c5e")
        .style("color", "#fff")
        .style("border-radius", "2px")
        .style("pointer-events", "none")
        .style("font-family", "'Roboto', sans-serif")
  }

  clear() {
    this.svg.remove();
  }
}
