import { Component, OnInit } from "@angular/core";
import * as app from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import { GpioService } from "../shared/gpio.service"
import { PalabraService } from "../shared/palabra.service"
import { Palabra } from "../model/palabra";
import { Pin } from "../model/pin";
import { alert, prompt, action } from "tns-core-modules/ui/dialogs"
import * as dialogs from "tns-core-modules/ui/dialogs";
import { registerElement } from "nativescript-angular/element-registry";
import { EventData } from "tns-core-modules/data/observable";

import { ListPicker } from "tns-core-modules/ui/list-picker";

registerElement("PullToRefresh", () => require("@nstudio/nativescript-pulltorefresh").PullToRefresh);

@Component({
    selector: "Search",
    templateUrl: "./search.component.html",
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    listaPalabras: Array<Palabra>
    listaPines: Array<Pin>
    //Dropdown
    public selectedIndex = 1;
    //Listpicker && Listview
    isVisible = false;
    public pinSelected: Pin = new Pin();


    constructor(private routerExtensions: RouterExtensions, private palabraService: PalabraService,
        private gpioService: GpioService) {
        // Use the constructor to inject services.
    }

    ngOnInit(): void {
        // Inicializar las palabras para mostrarlas en la vista
        this.palabraService.consultarPalabras().subscribe((result: any) => {
            this.listaPalabras = result.palabras;
            // console.log(this.listaPalabras);
        }, (error) => {
            this.alertMessage(error.message);
        }

        );

        // Inicializar los pines para mostrarlos en la vista
        this.gpioService.consultarPines().subscribe((result: any) => {
            this.listaPines = result.pines;
        }, (error) => {
            this.alertMessage(error.message);
        }

        );

    }

    public onSelectedIndexChanged(args: EventData) {
        const picker = <ListPicker>args.object;
        console.log(`index: ${picker.selectedIndex}; item" ${this.listaPalabras[picker.selectedIndex].palabra}`);
    }

    alertMessage(message: string) {
        return alert({
            title: "PIN",
            okButtonText: "OK",
            message: message
        });
    }

    alertAction(id: string) {
        return action({
            title: "¿Desea editar el pin?",
            cancelButtonText: "Cancelar",
            actions: ["Editar palabras", "Editar descripción"]
        }).then(r => {

            if (r == "Editar descripción") {

                this.gpioService.consultarPinById(id).
                    subscribe((result: any) => {
                        this.editarDescripcionPin(result);

                    }, (error) => {
                        this.alertMessage(error.message);
                    }
                    );

            } else if (r == "Editar palabras") {
                this.isVisible = true;

                this.gpioService.consultarPinById(id).
                    subscribe((result: any) => {
                        this.pinSelected = result;
                        console.log(this.pinSelected);

                    }, (error) => {
                        this.alertMessage(error.message);
                    }
                    );

            }
        });

    }

    refreshList(args: any) {
        const pullRefresh = args.object;
        // this.routerExtensions.navigate(["/search"]);
        setTimeout(function () {
            pullRefresh.refreshing = false;
        }, 1000);
    }

    editarDescripcionPin(resultPinById: any) {
        dialogs.prompt({
            title: "PIN",
            message: "Nueva descripción para el pin.",
            okButtonText: "OK",
            cancelButtonText: "Cancelar",
            inputType: dialogs.inputType.text
        }).then(r => {
            // console.log("Dialog result: " + r.result + ", text: " + r.text); 
            // console.log("Pin: " + resultPinById.pin.descripcion + ", text: " + r.text); 

            if (r.result == true) {

                //Subscribir promesa
                this.gpioService.editarPin({
                    numero: resultPinById.pin.numero,
                    descripcion: r.text,
                    palabraUno: resultPinById.pin.palabraUno,
                    palabraDos: resultPinById.pin.palabraDos,
                    palabraTres: resultPinById.pin.palabraTres

                }, resultPinById.pin._id
                ).subscribe((result: any) => {
                    this.alertMessage("Se ha modificado la descripción del pin");
                }, (error) => {
                    this.alertMessage(error.message);
                }
                );
            }
        });
    }

    cancelarEditarPalabra() {
        this.isVisible = false;
    }

}