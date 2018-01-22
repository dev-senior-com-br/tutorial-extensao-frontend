import { Component } from "@angular/core";

import { Tarefa } from "./tarefa"
import { TarefaService } from "./tarefa.service"

@Component({
    template: `<router-outlet></router-outlet>`,
})
export class TarefaComponent {};