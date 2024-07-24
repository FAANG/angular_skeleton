import { Injectable } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { PeriodicElement, ELEMENT_DATA } from "../../../src/app/shared/table/table.component";

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  constructor() { }

  getData(filters: any, search: string): Observable<PeriodicElement[]> {
    const dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    const filterToColumnMap: { [key: string]: keyof PeriodicElement } = {
      position: 'position',
      name: 'name',
      weight: 'weight',
      symbol: 'symbol'
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
            : dataValue === (typeof dataValue === 'number' ? parseFloat(filterValue) : filterValue);

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
      search: search.trim().toLowerCase()
    };

    dataSource.filter = JSON.stringify(combinedFilter);

    return of(dataSource.filteredData).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }
}
