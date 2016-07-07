import {Component, OnInit, Inject, OnDestroy } from "@angular/core"
import {ProjectService} from "../services/project.service"
import {EmployeeService} from "../services/employeeService"
import { ProjectService } from "../services/project.service"
import { ROUTER_DIRECTIVES } from "@angular/router"
import { Router, ActivatedRoute } from "@angular/router"
import {Employee} from "../services/employeeClasses";
import {TagService} from "../services/tagService";


@Component({
    selector: "addEmployee",
    templateUrl: "assets/app/dock/addEmployee.html",
    directives: [ROUTER_DIRECTIVES]
})

export default class AddEmployeeComponent implements OnInit, OnDestroy{
    private projectId: number = 0
    
    private projectService: ProjectService
    private employeeService: EmployeeService
    private route: ActivatedRoute
    private router: Router
    private error: string = ""
    private tagService: TagService
    private tag: string = ""
    private ready: boolean = false
    private nameStage: boolean = false
    private name: string = ""
    
    
    constructor (
        @Inject(ProjectService) $projectService: ProjectService,
        @Inject(EmployeeService) $employeeService: EmployeeService,
        @Inject(Router) $router: Router,
        @Inject(TagService) $tagService: TagService,
        @Inject(ActivatedRoute) $route: ActivatedRoute) {
        this.projectService = $projectService
        this.router = $router
        this.route = $route
        this.tagService = $tagService
        this.employeeService = $employeeService
    }

    refresh() {
        this.name = ""
        this.tag = ""
        this.nameStage = false
        this.ready = false
        this.error = ""
        this.tagService.close().then(res => {
            this.tagService.init()
            .then(res => {
                this.ready = true
                window.addEventListener("beforeunload", (e) => { 
                    this.tagService.close()
                })
                
                this.tagService.readTag().then(ta => {
                    this.tag = ta
                    this.ready = false
                    this.nameStage = true
                })
            })
            .catch(rej => this.error = rej)
        })
    }
    
    
    ngOnDestroy() {
        this.tagService.close()
    }
    
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.projectId = +params['id'] // (+) converts string 'id' to a number
        })
        this.tagService.init()
            .then(res => {
                this.ready = true
                window.addEventListener("beforeunload", (e) => { 
                    this.tagService.close()
                })
                
                this.tagService.readTag().then(ta => {
                    this.tag = ta
                    this.ready = false
                    this.nameStage = true
                })
            })
            .catch(rej => this.error = rej)
    }
    
    private save() {
        this.employeeService.addEmployee(this.projectId, this.name, this.tag).then( res => {
            if(res !== "ok"){
                this.error = res
            } else {
                this.tagService.close().then(res => {
                    let link = ["/dock"+"/"+this.projectId];
                    this.router.navigate(link);                   
                })
            }
        })
    }

    private cancel() {
        this.tagService.close().then(res => {
            let link = ["/dock"+"/"+this.projectId];
            this.router.navigate(link);                   
        })
    }

}