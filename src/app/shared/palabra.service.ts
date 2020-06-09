import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
})
export class PalabraService {
    private herokuUrl = "https://brotherapi.herokuapp.com/";

    constructor(private http: HttpClient) { }

    // Función para encender o apagar el bombillo
    consultarPalabras() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.get(
            this.herokuUrl + "api/palabras", { headers: headers });
    }

    agregarPalabra(data: any) {
        let headers = new HttpHeaders(
            {
                "Content-Type": "application/json"
            });

        return this.http.post(this.herokuUrl + "api/palabras", data, { headers: headers });
    }




}