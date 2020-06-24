import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
})
export class GpioService {
    private serverUrl = "https://unentered-caterpillar-1315.dataplicity.io/";
    private herokuUrl = "https://brotherapi.herokuapp.com/";

    constructor(private http: HttpClient) { }

    // Función para encender o apagar el bombillo
    cambiarEstado(data: any, pin: string) {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.post(
            this.serverUrl + "pin/" + pin + "/", data, { headers: headers });
    }

    // Función para consultar el estado del bombillo
    consultarEstado(pin: string) {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.get(
            this.serverUrl + "pin/" + pin + "/", { headers: headers });
    }

    // Función para consultar los pines creados
    consultarPines() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.get(
            this.herokuUrl + "api/pin", { headers: headers });
    }

    // Función para consultar los pines creados
    consultarPinById(id: string) {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return this.http.get(
            this.herokuUrl + "api/pin/" + id, { headers: headers });
    }

    agregarPin(data: any) {
        let headers = new HttpHeaders(
            {
                "Content-Type": "application/json"
            });

        return this.http.post(this.herokuUrl + "api/pin", data, { headers: headers });
    }

    editarPin(data: any, id: string) {
        let headers = new HttpHeaders(
            {
                "Content-Type": "application/json"
            });

        return this.http.put(this.herokuUrl + "api/pin/" + id, data, { headers: headers });
    }

}