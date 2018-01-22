import { Component } from "@angular/core";

@Component({
    template: require("./main.html"),
})
export class MainComponent {
    appName = $project.app;
    domainName = $project.domain;
    serviceName = $project.service;
    version = $version;
    name = $name;
    dependencies = $project.serviceDependencies;
};