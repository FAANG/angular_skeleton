import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import DataServiceInterface, {
  ColumnHeadersMapInterface,
} from './data.service.interface';

@Injectable({
  providedIn: 'root',
})
export class ElementsApiDataService implements DataServiceInterface {
  private apiUrl = '/elements';

  constructor(private http: HttpClient) {}

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
    let params = new HttpParams();

    if (filters) {
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          params = params.append(key, filters[key]);
        }
      }
    }

    if (search) {
      params = params.append('search', search.trim().toLowerCase());
    }

    return this.http.get<T[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching data from API', error);
        return of([] as T[]);
      })
    );
  }
}
