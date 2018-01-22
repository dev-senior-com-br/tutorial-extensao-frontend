import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { TranslateModule } from "@ngx-translate/core";
import * as prime from "primeng/primeng";

import { PermissionsService } from "./permissions.service";
import { DefaultHttpInterceptor } from "./default-http.interceptor";

@NgModule({
    exports: [
        ReactiveFormsModule,
        CommonModule,
        CurrencyMaskModule,
        TranslateModule,
        prime.PanelModule,
        prime.InputTextModule,
        prime.ButtonModule,
        prime.CheckboxModule,
        prime.DataTableModule,
        prime.SharedModule,
        prime.ConfirmDialogModule,
        prime.CalendarModule,
        prime.SpinnerModule,
        prime.DropdownModule,
    ],
    providers: [
        PermissionsService,
        { provide: HTTP_INTERCEPTORS, useClass: DefaultHttpInterceptor, multi: true }
    ]
})
export class SharedModule {};