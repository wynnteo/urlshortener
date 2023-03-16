import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class MainService {
    private static MAIN_SERVICE_URL = '/api';

    constructor(private http: HttpClient) {

    }
	
    getShortenURL(url: string) {
        return this.http.get(`${MainService.MAIN_SERVICE_URL}/${url}/getshortenurl`)
            .pipe(
                map(res => res),
                tap(() => {})
            );
    }

    createShortenURL(obj: any) {
        return this.http.post(`${MainService.MAIN_SERVICE_URL}/shorten`,
          obj
        );
    }
}