import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import AggregationServiceInterface, {
  ActiveFilterList,
  ActiveFiltersInterface,
  AggregationDataInterface,
  FilterMap,
} from './aggregation-service.interface';

@Injectable({
  providedIn: 'root',
})
export class ElementsAggregationService implements AggregationServiceInterface {
  active_filters: ActiveFiltersInterface = {};

  current_active_filters: ActiveFilterList = [];

  field: Subject<ActiveFiltersInterface> =
    new Subject<ActiveFiltersInterface>();

  data: BehaviorSubject<AggregationDataInterface> =
    new BehaviorSubject<AggregationDataInterface>({
      name: [],
      position: [],
      weight: [],
      symbol: [],
    });

  readonly filterMap: FilterMap = {
    Name: 'name',
    Position: 'position',
    Weight: 'weight',
    Symbol: 'symbol',
  };

  getAggregations(data: any): void {
    let aggregatedData: AggregationDataInterface = {
      name: [],
      position: [],
      weight: [],
      symbol: [],
    };

    const keys = Object.keys(
      aggregatedData
    ) as (keyof AggregationDataInterface)[];

    for (const idx in data) {
      let record = data[idx];
      for (const col of keys) {
        if (record[col]) {
          let value = record[col];
          let found = aggregatedData[col].find((item) => item[0] === value);
          if (found) {
            found[1]++;
          } else {
            aggregatedData[col].push([value, 1]);
          }
        }
      }
    }

    this.data.next(aggregatedData);
  }
}
