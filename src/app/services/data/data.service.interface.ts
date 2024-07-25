import { Observable } from 'rxjs';

export type DisplayedColumnsInterface = string[];

export interface ColumnHeadersMapInterface {
  [key: string]: string;
}

export default interface DataServiceInterface {
  getData<T extends {}>(filters: any, search: string): Observable<T[]>;
  displayedColumns: DisplayedColumnsInterface;
  columnHeadersMap: ColumnHeadersMapInterface;
}
