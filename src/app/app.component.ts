import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/components/common/messageservice";
import { Message } from "primeng/components/common/api";

@Component({
    selector: "body",
    template: require("./app.html"),
})
export class AppComponent implements OnInit {

    msgs: Message[] = [];

    constructor(
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.messageService.messageObserver.subscribe(this.onMessageAdded);
    }

    onMessageAdded(msg: Message) {
        if (!this.msgs) this.msgs = [];
        this.msgs.push(msg);
    }

}