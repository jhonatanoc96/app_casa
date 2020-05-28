import { Component, OnInit } from "@angular/core";
import { EventData } from "tns-core-modules/data/observable";
import { Switch } from "tns-core-modules/ui/switch";
import { HomeService } from "../shared/home.service";
import { RouterExtensions } from "nativescript-angular";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: ['../custom.css']

})
export class HomeComponent implements OnInit {

    constructor(private routerExtensions: RouterExtensions, private homeService: HomeService) { }

    ngOnInit(): void {

    }

    onCheckedChangeJhonatan(args: EventData) {
        let sw = args.object as Switch;
        let isChecked = sw.checked; // boolean

        if (isChecked) {
            this.cambiarEstado("jhonatan", 0);
        } else {
            this.cambiarEstado("jhonatan", 1);
        }

    }
  
    onCheckedChangeDanilo(args: EventData) {
        let sw = args.object as Switch;
        let isChecked = sw.checked; // boolean

        if (isChecked) {
            this.cambiarEstado("danilo", 0);
        } else {
            this.cambiarEstado("danilo", 1);
        }

    }

    onCheckedChangeSala(args: EventData) {
        let sw = args.object as Switch;
        let isChecked = sw.checked; // boolean

        if (isChecked) {
            this.cambiarEstado("sala", 0);
        } else {
            this.cambiarEstado("sala", 1);
        }

    }

    cambiarEstado(color: string, accion: number) {

        //Subscribir promesa
        this.homeService.cambiarEstado(
            {
                state: accion
            }, color
        ).subscribe((result: any) => {
            console.log(result);

        }, (error) => {
            console.log("error");
            this.alert("error", error.message);
        }

        );

    }

    alert(title: string, message: string) {
        return alert({
            title: title,
            okButtonText: "OK",
            message: message
        });
    }
}
