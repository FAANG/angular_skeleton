import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import AggregationServiceInterface, {
  ActiveFilterList,
  ActiveFiltersInterface,
  AggregationDataInterface,
  FilterMap,
} from './aggregation-service.interface';

interface MockElementsAggregationDataInterface
  extends AggregationDataInterface {
  name: [string, number][];
  position: [string, number][];
  weight: [string, number][];
  symbol: [string, number][];
}

interface MockElementsActiveFiltersInterface extends ActiveFiltersInterface {
  name: string[];
  position: string[];
  weight: string[];
  symbol: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MockElementsAggregationService
  implements AggregationServiceInterface
{
  active_filters: MockElementsActiveFiltersInterface = {
    name: [],
    position: [],
    weight: [],
    symbol: [],
  };

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

    const keys = Object.keys(aggregatedData) as (keyof AggregationDataInterface)[];

    data.forEach((record: any) => {
      keys.forEach((col) => {
        if (record[col]) {
          const value = record[col];
          const found = aggregatedData[col].find((item) => item[0] === value);
          if (found) {
            found[1]++;
          } else {
            aggregatedData[col].push([value, 1]);
          }
        }
      });
    });

    this.data.next(aggregatedData);
  }
}
