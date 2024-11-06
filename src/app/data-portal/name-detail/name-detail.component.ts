import { Component } from '@angular/core';
import { PeriodicElement, ELEMENT_DATA } from '../data-portal.component';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-name-detail',
  standalone: true,
  imports: [],
  templateUrl: './name-detail.component.html',
  styleUrl: './name-detail.component.css'
})
export class NameDetailComponent {
  element: PeriodicElement | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('id');
    this.element = ELEMENT_DATA.find(e => e.name === name);
  }
}
