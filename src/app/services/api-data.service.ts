import { Injectable } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";


class HostSetting {
}

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  hostSetting = new HostSetting;

  constructor() { }

  getData(dataSource: MatTableDataSource<any>): Observable<any[]> {
    return of(dataSource.data).pipe(
        catchError(() => {
          return of([]);
        })
    );
  }
}
