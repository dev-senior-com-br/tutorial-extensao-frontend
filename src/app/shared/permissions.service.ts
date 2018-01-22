import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

@Injectable()
export class PermissionsService {

    private actionUrl = `usuarios/userManager/actions/`;
    private resourceAddress = `res://senior.com.br/${$project.domain}/${$project.service}/entities/`;
    private defaultActions = ["Visualizar", "Incluir", "Editar", "Excluir"];
    private resources: string[] = ["tarefa"];
    private observable: Observable < any > ;
    private permissions: any;

    constructor(
        private http: HttpClient,
    ) {};

    get(resource: string = ""): Observable < any > {
        if (process.env.NODE_ENV == "development" && process.env.IGNORE_PERMISSIONS) {
            const permissions = {};
            this.defaultActions.forEach((action: any) => {
                const name = action.toLowerCase();
                permissions[name] = true;
            });
            return Observable.of(permissions);
        }

        if (this.permissions) this.observable = Observable.of(this.permissions);
        else if (!this.observable) this.observable = this.getPermissions().map((permissions: any) => this.permissions = permissions);

        return this.observable.map((permissions: any) => resource ? permissions[resource] : permissions);
    }

    private getPermissions() {
        return this.http
            .post(`${this.actionUrl}obterMeusDados`, {})
            .flatMap((userData: any) =>
                this.http
                .post(`${this.actionUrl}verificaPermissoesRecursos`, {
                    nomeUsuario: userData.nome,
                    recursos: this.resources.map((res: string) => ({
                        acoesPermissao: this.defaultActions,
                        uriRecurso: `${this.resourceAddress}${res}`,
                    })),
                })
                .map((res: any) => {
                    const { permissoes } = res;
                    const values = {};

                    permissoes.forEach((perm: any) => {
                        const name = perm.uriRecurso.replace(this.resourceAddress, "").toLowerCase();
                        values[name] = {};
                        perm.acoesPermissao.forEach((action: any) => {
                            values[name][action.nomeAcao.toLowerCase()] = action.permitido;
                        });
                    });

                    return values;
                })
            );
    }

}