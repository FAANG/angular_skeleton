import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import DataServiceInterface, {
  ColumnHeadersMapInterface,
} from './data.service.interface';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  test1: string;
  test2: string;
  test3: string;
  test4: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockElementsApiDataService implements DataServiceInterface {
  constructor() {}

  displayedColumns = [
    'name',
    'position',
    'weight',
    'symbol',
    'test1',
    'test2',
    'test3',
    'test4',
  ];

  columnHeadersMap: ColumnHeadersMapInterface = {
    name: 'Name',
    position: 'Position',
    weight: 'Weight',
    symbol: 'Symbol',
    test1: 'Test 1',
    test2: 'Test 2',
    test3: 'Test 3',
    test4: 'Test 4',
  };

  getData<T>(filters: any, search: string): Observable<T[]> {
    const dataSource = new MatTableDataSource<PeriodicElement>(ELEMENTS_DATA);

    const filterToColumnMap: { [key: string]: keyof PeriodicElement } = {
      position: 'position',
      name: 'name',
      weight: 'weight',
      symbol: 'symbol',
    };

    dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const searchTerms = JSON.parse(filter);
      let match = true;

      if (searchTerms.filters) {
        for (const key in searchTerms.filters) {
          const columnKey = filterToColumnMap[key];
          const filterValue = searchTerms.filters[key];
          const dataValue = data[columnKey];

          const isMatch = Array.isArray(filterValue)
            ? filterValue.includes(dataValue.toString())
            : dataValue ===
              (typeof dataValue === 'number'
                ? parseFloat(filterValue)
                : filterValue);

          if (!isMatch) {
            match = false;
            break;
          }
        }
      }

      if (searchTerms.search) {
        const searchStr = searchTerms.search.toLowerCase();
        const dataStr = JSON.stringify(data).toLowerCase();
        if (!dataStr.includes(searchStr)) {
          match = false;
        }
      }

      return match;
    };

    const combinedFilter = {
      filters: filters,
      search: search.trim().toLowerCase(),
    };

    dataSource.filter = JSON.stringify(combinedFilter);

    return of(dataSource.filteredData as unknown as T[]).pipe(
      catchError(() => {
        return of([] as T[]);
      })
    );
  }
}

const ELEMENTS_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
  {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    test1: 'test1',
    test2: 'test2',
    test3: 'test3',
    test4: 'test4',
  },
];
