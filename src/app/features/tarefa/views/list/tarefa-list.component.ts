import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LazyLoadEvent } from "primeng/components/common/api";
import { Subscription } from "rxjs/Subscription";
import { ConfirmationService } from "primeng/primeng";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/components/common/messageservice";
import { SortMeta } from "primeng/components/common/api";
import { Observable } from "rxjs";

import { Tarefa } from "../../tarefa"
import { TarefaService } from "../../tarefa.service"

@Component({
    template: require("./tarefa-list"),
    providers: [
        ConfirmationService,
    ]
})
export class TarefaListComponent implements OnInit, OnDestroy {

    private subscription: Subscription = new Subscription();
    private listSub: Subscription;
    private deleteSub: Subscription;

    permissions: any = {};
    gridRows = 10;
    gridData: Tarefa[];
    totalRecords: number;
    selected: Tarefa[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private tarefaService: TarefaService,
        private confirmationService: ConfirmationService,
        private translate: TranslateService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        const sub = this.route.parent.data.subscribe((data: any) => this.permissions = data.permissions);
        this.subscription.add(sub);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onGridChange($event: LazyLoadEvent) {
        const page = $event.first / this.gridRows;
        const sort = $event.multiSortMeta;
        return this.updateGrid(page, sort);
    }

    private updateGrid(page = 0, sort: SortMeta[] = []) {
        if (this.listSub) this.listSub.unsubscribe();
        this.listSub = this.tarefaService
            .list(page, sort)
            .subscribe((list: any) => {
                this.selected = [];
                this.gridData = list.contents;
                this.totalRecords = list.totalElements;
            });
    }

    onEditClick() {
        this.router.navigate(["../form"], { relativeTo: this.route, queryParams: { id: this.selected[0].id } });
    }

    onDeleteClick() {
        this.confirmationService.confirm({
            message: this.translate.instant("delete_confirmation_message"),
            header: this.translate.instant("delete_confirmation_title"),
            accept: () => {
                if (this.deleteSub) this.deleteSub.unsubscribe();
                this.deleteSub = this.getDeleteObservable().subscribe();
            }
        });
    }

    private getDeleteObservable() {
        return Observable
            .forkJoin(...this.selected.map(tarefa => this.tarefaService.delete(tarefa.id)))
            .do(() => {
                this.messageService.add({
                    severity: "success",
                    summary: this.translate.instant("deleted_message_title"),
                    detail: this.translate.instant("deleted_message_content")
                });
                this.updateGrid();
            });
    }

};