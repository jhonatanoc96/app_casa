import { Component, OnInit } from "@angular/core";
import * as app from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import { PalabraService } from "../shared/palabra.service"
import { Palabra } from "../model/palabra";
import { alert, prompt } from "tns-core-modules/ui/dialogs"


@Component({
    selector: "Search",
    templateUrl: "./search.component.html",
})
export class SearchComponent implements OnInit {

    listaPalabras: Array<Palabra>

    constructor(private router: RouterExtensions, private palabraService: PalabraService) {
        // Use the constructor to inject services.
    }

    ngOnInit(): void {
        // Inicializar las palabras para mostrarlas en la vista
        this.palabraService.consultarPalabras().subscribe((result: any) => {
            this.listaPalabras = result.palabras;
        }, (error) => {
            this.alert(error.message);
        }

        );
    }

    alert(message: string) {
        return alert({
            title: "Ejemplo Login",
            okButtonText: "OK",
            message: message
        });
    }

    refreshList(args) {
        var pullRefresh = args.object;
        setTimeout(function () {
            pullRefresh.refreshing = false;
        }, 1000);
    }

}
