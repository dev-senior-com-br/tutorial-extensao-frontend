import { NgModule } from "@angular/core";

import { MainModule } from "./main/main.module";

import { TarefaModule } from "./tarefa/tarefa.module";

@NgModule({
    imports: [
        MainModule,
        TarefaModule
    ]
})
export class FeaturesModule {};