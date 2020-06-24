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
    isVisibleEditarPalabras = false;
    idPalabraSelected: string;
    // Pines
    isVisiblePines = true;
    pinSelected: Pin = new Pin();
    // Titulo para menu de editar palabras
    defaultTitle: string = "Seleccione cuál palabra desea editar."
    // Ocultar botones para editar palabras
    isVisibleEditarPalabra1 = true;
    isVisibleEditarPalabra2 = true;
    isVisibleEditarPalabra3 = true;

    constructor(private routerExtensions: RouterExtensions, private palabraService: PalabraService,
        private gpioService: GpioService) {
        // Use the constructor to inject services.
    }

    ngOnInit(): void {
        // Inicializar las palabras para mostrarlas en la vista
        this.palabraService.consultarPalabras().subscribe((result: any) => {
            this.listaPalabras = result.palabras;
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

        // Inicializar pinSelected con cualquier valor para que no salga error
        this.gpioService.consultarPinById("5ed22ba4b7183e3eb827f4f0").subscribe((result: any) => {
            this.pinSelected = result;
        }, (error) => {
            this.alertMessage(error.message);
        }

        );

    }

    public onSelectedIndexChanged(args: EventData) {
        const picker = <ListPicker>args.object;
        this.idPalabraSelected = (`${this.listaPalabras[picker.selectedIndex]._id}`);
        // console.log(`index: ${picker.selectedIndex}; item" ${this.listaPalabras[picker.selectedIndex].palabra}`);
        // console.log(this.idPalabraSelected);
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
        this.isVisibleEditarPalabras = false;
        this.isVisibleEditarPalabra1 = true;
        this.isVisibleEditarPalabra2 = true;
        this.isVisibleEditarPalabra3 = true;
    }

    cancelarCrearPalabra() {
        this.isVisiblePines = true;
        this.isVisiblePalabras = false;
        this.isVisibleEditarPalabra1 = true;
        this.isVisibleEditarPalabra2 = true;
        this.isVisibleEditarPalabra3 = true;
    }

    public crearPalabras() {
        this.isVisiblePines = false;
        this.isVisiblePalabras = true;
        this.isVisible = false;
        this.isVisibleEditarPalabras = false;
        this.defaultTitle = "Seleccione cuál palabra desea editar.";
        this.isVisibleEditarPalabra1 = true;
        this.isVisibleEditarPalabra2 = true;
        this.isVisibleEditarPalabra3 = true;
    }

    public volverCrearPalabras() {
        this.isVisiblePines = true;
        this.isVisiblePalabras = false;
    }

    public editarPalabra1() {
        this.isVisibleEditarPalabras = true;
        this.defaultTitle = "Editando palabra 1";
        this.isVisibleEditarPalabra1 = false;
        this.isVisibleEditarPalabra2 = false;
        this.isVisibleEditarPalabra3 = false;
    }

    public editarPalabra2() {
        this.isVisibleEditarPalabras = true;
        this.defaultTitle = "Editando palabra 2";
        this.isVisibleEditarPalabra1 = false;
        this.isVisibleEditarPalabra2 = false;
        this.isVisibleEditarPalabra3 = false;
    }

    public editarPalabra3() {
        this.isVisibleEditarPalabras = true;
        this.defaultTitle = "Editando palabra 3";
        this.isVisibleEditarPalabra1 = false;
        this.isVisibleEditarPalabra2 = false;
        this.isVisibleEditarPalabra3 = false;
    }

    public volverEditarPalabras() {
        this.defaultTitle = "Seleccione cuál palabra desea editar.";
        this.isVisibleEditarPalabra1 = true;
        this.isVisibleEditarPalabra2 = true;
        this.isVisibleEditarPalabra3 = true;
        this.isVisibleEditarPalabras = false;
    }

    public submitEditarPalabras() {

        this.palabraService.consultarPalabraById(this.idPalabraSelected).
            subscribe((result: any) => {
                if (this.defaultTitle == "Editando palabra 1") {
                    //Subscribir promesa
                    this.gpioService.editarPin({
                        numero: this.pinSelected.pin.numero,
                        descripcion: this.pinSelected.pin.descripcion,
                        palabraUno: result.palabra,
                        palabraDos: this.pinSelected.pin.palabraDos,
                        palabraTres: this.pinSelected.pin.palabraTres

                    }, this.pinSelected.pin._id
                    ).subscribe((result2: any) => {
                        console.log(result2);
                        this.alertMessage("Se ha modificado la palabra");
                    }, (error) => {
                        console.log("error" + result);

                        this.alertMessage(error.message);
                    }
                    );
                } else if (this.defaultTitle == "Editando palabra 2") {
                    this.gpioService.editarPin({
                        numero: this.pinSelected.pin.numero,
                        descripcion: this.pinSelected.pin.descripcion,
                        palabraUno: this.pinSelected.pin.palabraUno,
                        palabraDos: result.palabra,
                        palabraTres: this.pinSelected.pin.palabraTres

                    }, this.pinSelected.pin._id
                    ).subscribe((result2: any) => {
                        console.log(result2);
                        this.alertMessage("Se ha modificado la palabra");
                    }, (error) => {
                        console.log("error" + result);

                        this.alertMessage(error.message);
                    }
                    );
                } else if (this.defaultTitle == "Editando palabra 3") {
                    this.gpioService.editarPin({
                        numero: this.pinSelected.pin.numero,
                        descripcion: this.pinSelected.pin.descripcion,
                        palabraUno: this.pinSelected.pin.palabraUno,
                        palabraDos: this.pinSelected.pin.palabraDos,
                        palabraTres: result.palabra

                    }, this.pinSelected.pin._id
                    ).subscribe((result2: any) => {
                        console.log(result2);
                        this.alertMessage("Se ha modificado la palabra");
                    }, (error) => {
                        console.log("error" + result);

                        this.alertMessage(error.message);
                    }
                    );
                }


            }, (error) => {
                this.alertMessage(error.message);
            }
            );

    }

}