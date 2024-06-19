import { Component, Output, EventEmitter } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() onClickEvent = new EventEmitter();

  onCLick() {
    this.onClickEvent.emit('');
  }

}
