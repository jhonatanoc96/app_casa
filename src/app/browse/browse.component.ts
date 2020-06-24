import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { SpeechRecognition, SpeechRecognitionTranscription, SpeechRecognitionOptions } from 'nativescript-speech-recognition';

@Component({
    selector: "Browse",
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {

    transcription: string;

    constructor(private speechRecognition: SpeechRecognition, private change: ChangeDetectorRef) {
        // this.triggerListening();
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
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
}
