import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { TarefaService } from "./tarefa.service"
import { TarefaComponent } from "./tarefa.component"
import { TarefaRouting } from "./tarefa.routing"
import { TarefaListComponent } from "./views/list/tarefa-list.component"
import { TarefaFormComponent } from "./views/form/tarefa-form.component"

@NgModule({
    imports: [
        SharedModule,
        TarefaRouting,
    ],
    declarations: [
        TarefaComponent,
        TarefaListComponent,
        TarefaFormComponent
    ],
    providers: [
        TarefaService
    ]
})
export class TarefaModule {};