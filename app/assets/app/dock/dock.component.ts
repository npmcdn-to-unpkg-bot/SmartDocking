import {Component, OnInit, Inject} from "@angular/core"
import {ProjectService} from "../services/project.service"
import {EmployeeService} from "../services/employeeService"
import { ProjectService } from "../services/project.service"
import { ROUTER_DIRECTIVES } from "@angular/router"
import { Router, ActivatedRoute } from "@angular/router"
import {Employee} from "../services/employeeClasses";

@Component({
    selector: "dock",
    templateUrl: "assets/app/dock/dock.html",
    directives: [ROUTER_DIRECTIVES]
})

export default class DockComponent implements OnInit {
    private projectId: number = 0
    
    private projectService: ProjectService
    private employeeService: EmployeeService
    private route: ActivatedRoute
    private router: Router
    private error = ""
    private employees: Employee[] = []
    
    constructor (
        @Inject(ProjectService) $projectService: ProjectService,
        @Inject(EmployeeService) $employeeService: EmployeeService,
        @Inject(Router) $router: Router,
        @Inject(ActivatedRoute) $route: ActivatedRoute) {
        this.projectService = $projectService
        this.router = $router
        this.route = $route
        this.employeeService = $employeeService
    }
    
    private getEmployees() {
        this.employeeService.getEmployees(this.projectId)
        .then(res => {
            this.employees = res
        })       
    }

    private delete(name:strin, rfid:string) {
        this.employeeService.removeEmployee(this.projectId, name, rfid).then(res => {
            if(res !== "ok") {
                this.error = res
            } else {
               this.getEmployees() 
            }
        })
    }
    
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.projectId = +params['id'] // (+) converts string 'id' to a number
            this.getEmployees()
        })
    }

}
