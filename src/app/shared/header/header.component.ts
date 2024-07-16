import { Component, OnInit } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatMenu,
    MatIcon,
    MatMenuTrigger
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

}
