import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { EventData } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { View } from 'tns-core-modules/ui/core/view';
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { Repeater } from "tns-core-modules/ui/repeater";


@Component({
    selector: "Browse",
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {

    // items: ObservableArray<any>;
    thisPage: Page;
    counter: number = 0;

    constructor() {
        // this.triggerListening();
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
        // this.items = new ObservableArray([]);
    }


    onPageLoad(args: EventData) {
        this.thisPage = <Page>args.object;
        this.thisPage.bindingContext = { items: new ObservableArray([]) };
    }

    addItem() {
        // this.items.push(this.counter.toString());
        // this.counter++;

        this.thisPage.bindingContext.items.push(this.counter.toString());
        this.counter++;
        // get a handle to the newly added View, remember it's added to the StackLayout
        let lastItemIndex = this.thisPage.bindingContext.items.length - 1,
            //get a handle to the repeater
            repeater: Repeater = <Repeater>this.thisPage.getViewById('repeatedItemsList'),
            //get the child (a StackLayout by default)
            repeaterStackLayout: StackLayout = <StackLayout>repeater.itemsLayout,
            //get the view at the index of our new item
            newChildView: View = repeaterStackLayout.getChildAt(lastItemIndex);

         console.log(repeater.itemsLayout.getChildrenCount);

        // if (newChildView) {
        //     console.log("prueba2");
        //     //set the scale of X and Y to zero (zoomed out)
        //     newChildView.scaleX = 0;
        //     newChildView.scaleY = 0;
        //     //animate the scales back to one over time to make a zoom in effect
        //     newChildView.animate({
        //         scale: { x: 1, y: 1 },
        //         duration: 300
        //     });
        // }
    }

    removeItem(arg: EventData) {
        let index = this.thisPage.bindingContext.items.indexOf((<View>arg.object).bindingContext);
        (<View>arg.object).animate({
            translate: { x: -500, y: 0 },
            duration: 300
        }).then(() => this.thisPage.bindingContext.items.splice(index, 1));
    }
}
