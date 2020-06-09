import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
})
export class GpioService {
    private serverUrl = "https://unentered-caterpillar-1315.dataplicity.io/";

    constructor(private http: HttpClient) { }

    // Función para encender o apagar el bombillo
    cambiarEstado(data: any, pin: string) {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.post(
            this.serverUrl + "pin/" + pin + "/", data, { headers: headers });
    }

}