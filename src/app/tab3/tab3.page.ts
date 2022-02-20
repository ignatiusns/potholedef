import { Component } from '@angular/core';
import { Pothole } from '../models/pothole';
import { PotholeService } from '../services/potholes.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public potholes: Pothole[];

  constructor(public potholeService: PotholeService) {}

  ngOnInit() {
    this.potholeService.getPotholes().subscribe ((res) => {
      console.log('after data service');
      console.log(res);
      this.potholes = res.map((t) => {
        console.log(t.payload.doc.data());
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Pothole
        };
      });
    });
  }  
}
