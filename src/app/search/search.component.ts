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

registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);
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
    selectedIndex = 1;
    //Listpicker Palabras && Listview
    isVisible = false;
    // Palabras
    isVisiblePalabras = false;
    // Pines
    isVisiblePines = true;
    pinSelected: Pin = new Pin();
    palabraUnoSelected: Palabra = new Palabra();
    palabraDosSelected: Palabra = new Palabra();
    palabraTresSelected: Palabra = new Palabra();




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
            title: "Aviso!",
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
                this.isVisiblePines = false;

                this.gpioService.consultarPinById(id).
                    subscribe((result: any) => {
                        this.pinSelected = result;

                        // Consultar la descripcion de la palabraUno del pin seleccionado
                        if (result.pin.palabraUno != null) {
                            this.palabraService.consultarPalabraById(result.pin.palabraUno).
                                subscribe((resultPalabraUno: any) => {
                                    this.palabraUnoSelected = resultPalabraUno;
                                }, (error) => {
                                    this.alertMessage(error.message);
                                    this.palabraUnoSelected = null;
                                }
                                );
                        }

                        // Consultar la descripcion de la palabraDos del pin seleccionado
                        if (result.pin.palabraDos != null) {
                            this.palabraService.consultarPalabraById(result.pin.palabraDos).
                                subscribe((resultPalabraDos: any) => {
                                    this.palabraDosSelected = resultPalabraDos;
                                }, (error) => {
                                    this.alertMessage(error.message);
                                    this.palabraDosSelected = null;
                                }
                                );
                        }

                        // Consultar la descripcion de la palabraTres del pin seleccionado
                        if (result.pin.palabraTres != null) {
                            this.palabraService.consultarPalabraById(result.pin.palabraTres).
                                subscribe((resultPalabraTres: any) => {
                                    this.palabraTresSelected = resultPalabraTres;
                                }, (error) => {
                                    this.alertMessage(error.message);
                                    this.palabraTresSelected = null;
                                }
                                );

                        }


                    }, (error) => {
                        this.alertMessage(error.message);
                    }
                    );

            }
        });

    }

    alertActionPalabras(id: string) {
        return action({
            title: "¿Desea editar el pin?",
            cancelButtonText: "Cancelar",
            actions: ["Editar palabra", "Eliminar palabra"]
        }).then(r => {

            if (r == "Editar palabra") {

                this.palabraService.consultarPalabraById(id).
                    subscribe((result: any) => {
                        this.editarPalabras(result);

                    }, (error) => {
                        this.alertMessage(error.message);
                    }
                    );

            } else if (r == "Eliminar palabra") {
                this.palabraService.eliminarPalabra(id).
                    subscribe((result: any) => {
                        this.alertMessage(result.message);

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

    editarPalabras(resultPalabraById: any) {
        dialogs.prompt({
            title: "Editar palabra",
            message: "Ingrese nueva palabra",
            okButtonText: "OK",
            cancelButtonText: "Cancelar",
            inputType: dialogs.inputType.text
        }).then(r => {
            // console.log("Dialog result: " + r.result + ", text: " + r.text); 
            // console.log("Pin: " + resultPinById.pin.descripcion + ", text: " + r.text); 

            if (r.result == true) {

                console.log(resultPalabraById);

                //Subscribir promesa
                this.palabraService.editarPalabra({
                    estado: resultPalabraById.palabra.estado,
                    palabra: r.text

                }, resultPalabraById.palabra._id
                ).subscribe((result: any) => {
                    this.alertMessage("Se ha modificado la palabra");
                }, (error) => {
                    if (error.status == 500) {
                        this.alertMessage("La palabra: '" + r.text + "' ya existe.");
                    } else {
                        this.alertMessage(error.message);
                    }
                }
                );
            }
        });
    }

    palabraNueva() {
        dialogs.prompt({
            title: "Crear nueva palabra",
            message: "Ingrese la palabra que desea crear.",
            okButtonText: "OK",
            cancelButtonText: "Cancelar",
            inputType: dialogs.inputType.text
        }).then(r => {
            // console.log("Dialog result: " + r.result + ", text: " + r.text); 
            // console.log("Pin: " + resultPinById.pin.descripcion + ", text: " + r.text); 

            //Subscribir promesa
            this.palabraService.agregarPalabra({
                palabra: r.text,
                estado: true
            }
            ).subscribe((result: any) => {
                this.alertMessage("Se ha creado la palabra: '" + r.text + "'");
            }, (error) => {
                //Si se presiona "cancelar"
                if (r.result == false) {
                    //no hacer nada
                } else {
                    if (error.status == 500) {
                        this.alertMessage("La palabra: '" + r.text + "' ya existe.");
                    } else {
                        this.alertMessage(error.message);
                    }
                }
            }
            );
        });
    }

    cancelarEditarPalabra() {
        this.isVisible = false;
        this.isVisiblePines = true;
    }

    cancelarCrearPalabra() {
        this.isVisiblePines = true;
        this.isVisiblePalabras = false;
    }

    public crearPalabras() {
        this.isVisiblePines = false;
        this.isVisiblePalabras = true;
        this.isVisible = false;
    }

    public volverCrearPalabras() {
        this.isVisiblePines = true;
        this.isVisiblePalabras = false;
    }


}