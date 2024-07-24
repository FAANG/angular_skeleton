import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from "rxjs";

interface AggregationData {
  name: [string, number][];
  position: [string, number][];
  weight: [string, number][];
  symbol: [string, number][];
}

interface ActiveFilters {
  name: string[];
  position: string[];
  weight: string[];
  symbol: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AggregationService {
  active_filters: ActiveFilters = {
    name: [],
    position: [],
    weight: [],
    symbol: []
  };

  current_active_filters: string[] = [];

  data: BehaviorSubject<AggregationData> = new BehaviorSubject<AggregationData>(
      { name: [], position: [], weight: [], symbol: [] }
  );
  field = new Subject<ActiveFilters>();

  constructor() {}

  getAggregations(data: any) {
    let aggregatedData: AggregationData = {
      name: [],
      position: [],
      weight: [],
      symbol: []
    };

    const keys = Object.keys(aggregatedData) as (keyof AggregationData)[];

    for (const idx in data) {
      let record = data[idx];
      for (const col of keys) {
        if (record[col]) {
          let value = record[col];
          let found = aggregatedData[col].find(item => item[0] === value);
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
