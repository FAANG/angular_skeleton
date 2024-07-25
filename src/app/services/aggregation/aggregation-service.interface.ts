import { BehaviorSubject, Subject } from 'rxjs';

export interface AggregationDataInterface {
  [key: string]: [string, number][];
}

export interface ActiveFiltersInterface {
  [key: string]: string[];
}

export type ActiveFilterList = string[];

export type FilterMap = { [key: string]: keyof AggregationDataInterface };

export default interface AggregationServiceInterface {
  active_filters: ActiveFiltersInterface;

  current_active_filters: ActiveFilterList;

  field: Subject<ActiveFiltersInterface>;

  data: BehaviorSubject<AggregationDataInterface>;

  readonly filterMap: FilterMap;

  //data: BehaviorSubject<AggregationDataInterface>
  getAggregations(data: any): void;
}
