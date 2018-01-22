import { NgModule, Injectable } from "@angular/core";
import { RouterModule, Routes, Resolve, CanActivate } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { MessageService } from "primeng/components/common/messageservice";
import { TranslateService } from "@ngx-translate/core";

import { PermissionsService } from "../../shared/permissions.service";

import { TarefaComponent } from "./tarefa.component"
import { TarefaListComponent } from "./views/list/tarefa-list.component"
import { TarefaFormComponent } from "./views/form/tarefa-form.component"

@Injectable()
class TarefaRoutingGuard implements CanActivate {

    constructor(
        private permissionsService: PermissionsService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {}

    canActivate(): Observable < boolean > {
        return this.permissionsService
            .get("tarefa")
            .map((permissions: any) => {
                if (!permissions.visualizar) this.messageService.add({
                    severity: "error",
                    summary: "403",
                    detail: this.translate.instant("not_authorized"),
                });
                return permissions.visualizar;
            });
    }
}

@Injectable()
export class TarefaRoutingResolver implements Resolve < any > {

    constructor(
        private permissionsService: PermissionsService
    ) {}

    resolve(): Observable < any > {
        return this.permissionsService.get("tarefa");
    }
}


export const routes: Routes = [{
    path: "tarefa",
    component: TarefaComponent,
    children: [{
            path: "",
            redirectTo: "list",
            pathMatch: "full",
        },

        {
            path: "list",
            component: TarefaListComponent,
        },
        {
            path: "form",
            component: TarefaFormComponent,
        },

    ],
    resolve: {
        permissions: TarefaRoutingResolver,
    },
    canActivate: [TarefaRoutingGuard]
}];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
    providers: [
        TarefaRoutingGuard,
        TarefaRoutingResolver,
    ]
})
export class TarefaRouting {};