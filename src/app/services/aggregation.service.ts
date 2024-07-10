import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from "rxjs";

interface AggregationData {
  sex: [string, number][];
  organism: [string, number][];
  breed: [string, number][];
  standard: [string, number][];
}

interface ActiveFilters {
  sex: string[];
  organism: string[];
  breed: string[];
  standard: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AggregationService {
  active_filters: ActiveFilters = {
    sex: [],
    organism: [],
    breed: [],
    standard: []
  };

  current_active_filters: string[] = [];

  data: BehaviorSubject<AggregationData> = new BehaviorSubject<AggregationData>(
      { sex: [], organism: [], breed: [], standard: [] }
  );
  field = new Subject<ActiveFilters>();

  constructor() {}

  getAggregations(data: any) {
    let aggregatedData: AggregationData = {
      sex: [],
      organism: [],
      breed: [],
      standard: []
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
