import { Injectable } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Sample, samples } from "../../../src/app/samples";

@Injectable({
    providedIn: 'root'
})
export class ApiDataService {
    constructor() { }

    getData(filters: any, search: string): Observable<Sample[]> {
        const dataSource = new MatTableDataSource<Sample>(samples);

        const filterToColumnMap: { [key: string]: keyof Sample } = {
            sex: 'sex',
            organism: 'organism',
            breed: 'breed',
            standard: 'standard'
        };

        dataSource.filterPredicate = (data: Sample, filter: string) => {
            const searchTerms = JSON.parse(filter);
            let match = true;

            if (searchTerms.filters) {
                for (const key in searchTerms.filters) {
                    const columnKey = filterToColumnMap[key];
                    if (Array.isArray(searchTerms.filters[key])) {
                        if (!searchTerms.filters[key].includes(data[columnKey])) {
                            match = false;
                            break;
                        }
                    } else {
                        if (searchTerms.filters[key] && data[columnKey] !== searchTerms.filters[key]) {
                            match = false;
                            break;
                        }
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
