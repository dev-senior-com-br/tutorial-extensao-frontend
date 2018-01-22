import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";

export const routes: Routes = [{
        path: "main",
        component: MainComponent,
    },
    {
        path: "",
        redirectTo: "/main",
        pathMatch: "full",
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class MainRouting {};