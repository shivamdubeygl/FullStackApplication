import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})

export class PiechartComponent implements OnChanges, AfterViewInit  {
  @Input() fileName!: string;
  chartData: any[] = [];
  displayFileName!: string; // Separate variable for display purposes
  @ViewChild('pieChart', { static: true }) private chartContainer!: ElementRef;

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileName'] && changes['fileName'].currentValue) {
      // Remove the ".xlsx" extension from the file name
      this.displayFileName = this.fileName.replace('.xlsx', ''); // Modify the file name for display
      this.apiService.getPieChartData(this.fileName).subscribe(
        (data: any) => {
          this.chartData = this.formatDataForPieChart(data); // Assign fetched data to chartData
          console.log('Fetched data:', this.chartData); // Log the fetched data
          if (this.chartContainer) {
            console.log("about to start creating chart")
            this.createPieChart();
          }
        },
        (error: any) => {
          console.error('Error fetching pie chart data:', error);
        }
      );
    }
  }

  ngAfterViewInit(): void {
    
    // if (this.chartData) {
    //   this.createPieChart();
    // }
  }
  formatDataForPieChart(data: any): { label: string, value: number }[] {
    // Transform fetched data into chart-friendly format
    const formattedData: { label: string, value: number }[] = [];

    if (data && Array.isArray(data['Issuer Name']) && Array.isArray(data['Market Cap'])) {
      const issuerNames = data['Issuer Name'];
      const marketCaps = data['Market Cap'];

      for (let i = 0; i < issuerNames.length; i++) {
        formattedData.push({ label: issuerNames[i], value: marketCaps[i] });
      }
    }

    return formattedData;
  }
  
  createPieChart(): void {
    console.log("Creating chart")
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;
  
    // Select the existing chart SVG and remove it
    d3.select(this.chartContainer.nativeElement).select("svg").remove();
  
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);
  
    const pie = d3.pie<any, { value: number }>()
      .sort(null)
      .value((d: any) => d.value);
  
    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', 1600)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
    const arcs = pie(this.chartData);
  
    svg.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d: any) => color(d.data.label))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .append("title")
      .text((d: any) => {
        const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
        return `${d.data.label}: ${percent.toFixed(1)}%`;
      });
  
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 150},${20})`)
      .selectAll(".legend")
      .data(arcs)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d: any, i: number) => `translate(0,${i * 20})`);
  
    legend.append("rect")
      .attr("x", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d: any) => color(d.data.label));
  
    legend.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .attr("dy", ".35em")
      .text((d: any) => d.data.label);
  }   
}