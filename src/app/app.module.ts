import { Injector, NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LocationStrategy, HashLocationStrategy, LOCATION_INITIALIZED } from "@angular/common";
import { HttpModule } from "@angular/http";
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { CookieService } from "angular2-cookie/services/cookies.service";
import { GrowlModule } from "primeng/primeng";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MessageService } from "primeng/components/common/messageservice";
import { user, service, config } from "gianpasqualini-platform-data";

import { FeaturesModule } from "./features/features.module";
import { AppComponent } from "./app.component";
import "./app.scss";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "left",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 3,
    prefix: "R$ ",
    suffix: "",
    thousands: "."
};

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "", ".json");
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        FeaturesModule,
        GrowlModule,
    ],
    declarations: [AppComponent],
    providers: [
        CookieService,
        MessageService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector, HttpClient],
            multi: true
        },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {};

function appInitializerFactory(translate: TranslateService, injector: Injector, http: HttpClient) {
    return () => new Promise < any > ((resolve: any) => {
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

        locationInitialized.then(async () => {
            translate.setTranslation("fallback", $locales.fallback);
            translate.setDefaultLang("fallback");

            try {
                config.setDataOrigin("IFRAME");
                const bridgeUrl = await service.getRestUrl();
                if (!bridgeUrl) throw "Backend address not found!";

                const params = new HttpParams()
                    .set("domainName", $project.domain)
                    .set("serviceName", $project.service)
                    .set("format", "FLAT_JSON");

                const headers = new HttpHeaders().set("Authorization", await user.getAuthHeader());

                let url = `${bridgeUrl}platform/translation_hub/queries/getTranslationBundle`;
                const bundlesPromise = http.get(url, { headers, params }).toPromise().then((res: any) => res.bundleFiles);

                url = `${bridgeUrl}usuarios/userManager/actions/obterMeusDados`;
                const userDataPromise = http.post(url, {}, { headers }).toPromise();

                const [bundles, userData]: any = await Promise.all([bundlesPromise, userDataPromise]);
                let userLanguage = userData.localidade && bundles.find((bundle: any) => bundle.language == userData.localidade);

                if (!userLanguage) userLanguage = bundles.find((bundle: any) => bundle.language == "pt-BR");
                if (!userLanguage) return resolve();

                url = userLanguage.url;
                const translation = await http.get(url).toPromise();
                translate.setTranslation(userLanguage.language, translation);
                await translate.use(userLanguage.language).toPromise();

                resolve();
            } catch (err) {
                console.warn("Error getting translation bundles. Using fallback.", err);
                await translate.use("fallback").toPromise();
                resolve();
            }
        });
    });
}