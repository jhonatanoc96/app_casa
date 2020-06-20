import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
})
export class PalabraService {
    private herokuUrl = "https://brotherapi.herokuapp.com/";

    constructor(private http: HttpClient) { }

    // Función para consultar las palabras creadas.
    consultarPalabras() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.get(
            this.herokuUrl + "api/palabras", { headers: headers });
    }

    consultarPalabraById(id: string) {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.get(
            this.herokuUrl + "api/palabras/" + id, { headers: headers });
    }

    agregarPalabra(data: any) {
        let headers = new HttpHeaders(
            {
                "Content-Type": "application/json"
            });

        return this.http.post(this.herokuUrl + "api/palabras", data, { headers: headers });
    }

    editarPalabra(data: any, id: string) {
        let headers = new HttpHeaders(
            {
                "Content-Type": "application/json"
            });

        return this.http.put(this.herokuUrl + "api/palabras/" + id, data, { headers: headers });
    }

    eliminarPalabra(id: string) {
        let headers = new HttpHeaders(
            {
                "Content-Type": "application/json"
            });

        return this.http.delete(this.herokuUrl + "api/palabras/" + id, { headers: headers });
    }



}