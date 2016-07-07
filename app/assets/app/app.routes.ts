import { provideRouter, RouterConfig } from "@angular/router"
import ProjectsComponent from "./project/projects.component"
import EditProjectComponent from "./project/edit.project.component"
import DockComponent from "./dock/dock.component"
import AddEmployeeComponent from "./dock/add.employee.component"

export const routes: RouterConfig = [
  { path: "projects", component: ProjectsComponent },
  { path: "editProject/:id", component: EditProjectComponent },
  { path: "dock/:id", component: DockComponent },
  { path: "addEmployee/:id", component: AddEmployeeComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];