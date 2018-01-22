import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { HttpParams, HttpClient } from "@angular/common/http";
import { SortMeta } from "primeng/components/common/api";
import { Observable } from "rxjs/Rx";

import { Tarefa } from "./tarefa"

@Injectable()
export class TarefaService {

    private entityUrl = `${$project.domain}/${$project.service}/entities/tarefa`;

    constructor(
        private http: HttpClient,
    ) {};

    list(page: number, sort: SortMeta[]): Observable < Tarefa[] > {
        let params = new HttpParams();
        params = params.append("size", String(10));
        params = params.append("offset", String(page));

        if (sort && sort.length) {
            params = params.append("orderby", sort.map(s => {
                let order = "";
                if (s.order === 1) order = " asc";
                else if (s.order === -1) order = " desc";
                return `${s.field}${order}`;
            }).join(", "));
        }

        return this.http.get < Tarefa[] > (this.entityUrl, { params });
    }

    get(id: any): Observable < Tarefa > {
        return this.http.get < Tarefa > (`${this.entityUrl}/${id}`);
    }

    insert(entity: Tarefa): Observable < Tarefa > {
        return this.http.post < Tarefa > (`${this.entityUrl}`, entity);
    }

    update(entity: Tarefa): Observable < Tarefa > {
        return this.http.put < Tarefa > (`${this.entityUrl}/${entity.id}`, entity);
    }

    delete(id: any): Observable < Tarefa > {
        return this.http.delete < Tarefa > (`${this.entityUrl}/${id}`);
    }

}