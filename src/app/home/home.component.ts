import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { EventData } from "tns-core-modules/data/observable";
import { Switch } from "tns-core-modules/ui/switch";
import { GpioService } from "../shared/gpio.service";
import { RouterExtensions } from "nativescript-angular";
import { SpeechRecognition, SpeechRecognitionTranscription, SpeechRecognitionOptions } from 'nativescript-speech-recognition';
import { Pin } from "../model/pin";
import { templateJitUrl } from "@angular/compiler";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {

    transcription: string;
    isRecording = true;
    listaPines: Array<Pin>;

    constructor(private routerExtensions: RouterExtensions, private gpioService: GpioService,
        private speechRecognition: SpeechRecognition, private change: ChangeDetectorRef) { }

    ngOnInit(): void {
        // Inicializar los pines para mostrarlos en la vista
        this.gpioService.consultarPines().subscribe((result: any) => {
            this.listaPines = result.pines;
        }, (error) => {
            this.alertMessage(error.message);
        }

        );

    }

    alertMessage(message: string) {
        return alert({
            title: "Aviso!",
            okButtonText: "OK",
            message: message
        });
    }


    onCheckedChangeVentilador(args: EventData) {
        let sw = args.object as Switch;
        let isChecked = sw.checked; // boolean

        if (isChecked) {
            this.cambiarEstado("ventilador", 0);
        } else {
            this.cambiarEstado("ventilador", 1);
        }

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
        this.gpioService.cambiarEstado(
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

    triggerListening() {
        this.speechRecognition.available().then(available => {
            // console.log(available) 
            available ? this.listen() : alert('Speech recognition is not available!');
        })
            .catch(error => console.error(error));

    }

    listen() {
        const options: SpeechRecognitionOptions = {
            locale: 'es-ES',
            onResult: (transcription: SpeechRecognitionTranscription) => {
                console.log(`Text: ${transcription.text}, Finished: ${transcription.finished}`);
                this.transcription = transcription.text;


                // this.listaPines.forEach(function (value) {
                // });
                let i = 0;
                for (i = 0; i < this.listaPines.length; i++) {
                    if (this.transcription === this.listaPines[i].palabraUno.palabra
                        || this.transcription === this.listaPines[i].palabraDos.palabra
                        || this.transcription === this.listaPines[i].palabraTres.palabra) {

                        switch (this.listaPines[i].numero) {
                            case 3: //Ventilador
                                this.gpioService.consultarEstado("ventilador").subscribe((result: any) => {
                                    console.log(result.ventilador);
                                    if (result.ventilador == 1) {
                                        this.cambiarEstado("ventilador", 0);
                                    } else {
                                        this.cambiarEstado("ventilador", 1);
                                    }
                                }, (error) => {
                                    this.alertMessage(error.message);
                                }
                                

                                );
                                break;
                            case 5: //Jhonatan
                                this.gpioService.consultarEstado("jhonatan").subscribe((result: any) => {
                                    console.log(result.jhonatan);
                                    if (result.jhonatan == 1) {
                                        this.cambiarEstado("jhonatan", 0);
                                    } else {
                                        this.cambiarEstado("jhonatan", 1);
                                    }
                                }, (error) => {
                                    this.alertMessage(error.message);
                                }

                                );
                                break;
                            case 8: //Danilo
                                this.gpioService.consultarEstado("danilo").subscribe((result: any) => {
                                    console.log(result.danilo);
                                    if (result.danilo == 1) {
                                        this.cambiarEstado("danilo", 0);
                                    } else {
                                        this.cambiarEstado("danilo", 1);
                                    }
                                }, (error) => {
                                    this.alertMessage(error.message);
                                }

                                );
                                break;
                            case 10: //Sala
                                this.gpioService.consultarEstado("sala").subscribe((result: any) => {
                                    console.log(result.sala);
                                    if (result.sala == 1) {
                                        this.cambiarEstado("sala", 0);
                                    } else {
                                        this.cambiarEstado("sala", 1);
                                    }
                                }, (error) => {
                                    this.alertMessage(error.message);
                                }

                                ); break;


                        }
                    }
                }


                this.change.detectChanges();

            }
        }

        this.speechRecognition.startListening(options)
            .then(() => console.log("Started listening"))
            .catch(error => console.error(error));
    }

    stopListening() {
        this.speechRecognition.stopListening()
            .then(() => console.log("Stopped listening."))
            .catch(error => console.error(error));
    }

    recorrerListaPines(lista: any, id: any) {
        lista.forEach(function (value) {

            this.gpioService.consultarPinById(id).
                subscribe((result: any) => {
                    console.log(result);
                }, (error) => {
                    this.alertMessage(error.message);
                }
                );

        });
    }

}
