import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { MainRouting } from "./main.routing";
import { MainComponent } from "./main.component";

@NgModule({
    imports: [
        SharedModule,
        MainRouting,
    ],
    declarations: [MainComponent],
})
export class MainModule {};