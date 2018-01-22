import * as moment from "moment";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/primeng";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs/Subscription";

import { Tarefa } from "../../tarefa";
import { TarefaService } from "../../tarefa.service";

@Component({
    template: require("./tarefa-form"),
    providers: [
        ConfirmationService,
    ]
})
export class TarefaFormComponent implements OnInit, OnDestroy {

    private subscription: Subscription = new Subscription();
    private saveSub: Subscription;
    private deleteSub: Subscription;

    private id: string;
    permissions: any = {};
    isNew: boolean;
    formGroup: FormGroup;
    loading: boolean;


    constructor(
        private tarefaService: TarefaService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
    ) {
        this.createForm();
    }

    ngOnInit() {
        let sub = this.route.queryParams.subscribe(params => {
            this.id = params.id;
            this.isNew = !params.id;

            if (!this.isNew) {
                this.loading = true;
                this.tarefaService.get(this.id)
                    .subscribe((tarefa: Tarefa) => {
                        const canEdit = this.isNew || this.permissions.editar;
                        if (!canEdit) this.formGroup.disable();
                        this.setValues(tarefa);
                        this.loading = false;
                    });
            } else {
                this.setValues(new Tarefa());
            }
        });
        this.subscription.add(sub);

        sub = this.route.parent.data.subscribe((data: any) => this.permissions = data.permissions);
        this.subscription.add(sub);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({

            "id": [
                { value: "", disabled: false },
                [Validators.required, Validators.pattern(/^\-?\d*$/)]
            ],
            "titulo": [
                { value: "", disabled: false },
                [Validators.required]
            ],
            "data": [
                { value: "", disabled: false },
                [Validators.required]
            ],
            "description": [
                { value: "", disabled: false },
                [Validators.required]
            ],
        });
    }

    private setValues(tarefa: Tarefa) {
        const formValues = this.modelToForm(tarefa);
        this.createForm();
        this.formGroup.patchValue(formValues);
    }

    private goBack() {
        this.router.navigate(["../"], { relativeTo: this.route });
    }

    private formToModel(values: any): Tarefa {
        const tarefa: any = { ...values };



        return tarefa;
    }

    private modelToForm(Tarefa: Tarefa): any {
        const tarefa: any = { ...Tarefa };


        tarefa.data = tarefa.data && moment(tarefa.data).toDate();


        return tarefa;
    }

    cancel() {
        this.goBack();
    }

    save() {
        if (this.saveSub) this.saveSub.unsubscribe();
        this.saveSub = this.getSaveObservable().subscribe(() => this.goBack());
    }

    private getSaveObservable() {
        const { value, valid } = this.formGroup;
        const tarefa: Tarefa = this.formToModel(value);

        let observable;
        if (this.isNew) observable = this.tarefaService.insert(tarefa);
        else observable = this.tarefaService.update(tarefa);

        return observable.do((res: Tarefa) => {
            this.messageService.add({
                severity: "success",
                summary: this.translate.instant("saved_message_title"),
                detail: this.translate.instant("saved_message_content")
            });
        });
    }

    delete() {
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
        return this.tarefaService.delete(this.id).do(() => {
            this.messageService.add({
                severity: "success",
                summary: this.translate.instant("deleted_message_title"),
                detail: this.translate.instant("deleted_message_content")
            });
            this.goBack();
        });
    }

};