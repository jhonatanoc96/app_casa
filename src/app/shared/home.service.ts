import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private serverUrl = "https://unentered-caterpillar-1315.dataplicity.io/";
    //   private token: string;

    constructor(private http: HttpClient) { }

    cambiarEstado(data: any, pin: string) {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.post(
            this.serverUrl + "pin/" + pin + "/", data, { headers: headers });
    }


}