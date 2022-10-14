import { Component, OnInit } from '@angular/core';
import { Agenda, AgendaContainer } from '@sentinel/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  agendaContainers: AgendaContainer[];

  constructor() { }

  ngOnInit() {
    const containers = [new Agenda('Clustering', '')];
    this.agendaContainers = [new AgendaContainer('Visualizations', containers)];
  }
}
