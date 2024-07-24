import {PeriodicElement} from "./data-portal/data-portal.component";

export interface Sample {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  test1: string;
  test2: string;
  test3: string;
  test4: string;
}

export const samples: Sample[] = [
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
