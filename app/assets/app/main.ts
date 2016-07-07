import { bootstrap } from "@angular/platform-browser-dynamic"
import {AppComponent} from "./app.component"
import { HTTP_PROVIDERS } from "@angular/http"
import {ProjectService} from "./services/project.service"
import { APP_ROUTER_PROVIDERS } from "./app.routes"
import { UserService } from "./services/user.service"
import { EmployeeService } from "./services/employeeService"
import { TagService } from "./services/tagService"

import "./rxjs-operators"
import AddEmployeeComponent from "./dock/add.employee.component";

bootstrap(AppComponent, [APP_ROUTER_PROVIDERS, HTTP_PROVIDERS, ProjectService, UserService, EmployeeService, AddEmployeeComponent, TagService])
