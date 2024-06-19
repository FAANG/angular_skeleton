import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatTableModule, MatTableDataSource} from "@angular/material/table";
import {HeaderComponent} from "../shared/header/header.component";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FooterComponent} from "../shared/footer/footer.component";
import {MediaMatcher} from "@angular/cdk/layout";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  test1: string,
  test2: string,
  test3: string,
  test4: string,
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', },
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
];

@Component({
  selector: 'app-data-portal',
  standalone: true,
  imports: [MatCardModule, MatTableModule, HeaderComponent, MatInputModule, MatFormFieldModule,
    MatSidenavModule, FooterComponent],
  templateUrl: './data-portal.component.html',
  styleUrl: './data-portal.component.css'
})
export class DataPortalComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  opened = true;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'test1', 'test2', 'test3', 'test4'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggle() {
    this.opened = !this.opened;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
