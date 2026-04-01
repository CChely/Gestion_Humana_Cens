import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit {

   searchInputControl: UntypedFormControl = new UntypedFormControl();
   
  constructor() { }

  ngOnInit(): void {
  }

}
