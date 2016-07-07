import { Injectable, Inject } from "@angular/core"
import { Http, Response } from "@angular/http"
import { Headers, RequestOptions } from "@angular/http"
import { Employee } from "./employeeClasses"


@Injectable()
export class EmployeeService {
    
    private getEmployeesUrl = "/getEmployees"
    private addEmployeeUrl = "/addEmployees"
    private deleteEmployeeUrl = "/deleteEmployee"

    constructor(@Inject(Http) private http:Http) {
    }
    
    public getEmployees(id:number): Promise<Employee[]> {
        return this.http.get(this.getEmployeesUrl+"?id="+id).toPromise().
            then(this.extractData)
    }
    
    public removeEmployee(id: number, name: string, rfid: string) {
        return this.http.get(this.deleteEmployeeUrl+"?id=" + id + "&name=" + name + "&rfid=" + rfid)
            .toPromise()
            .then(res => res.text())    
    }

    public addEmployee(id: number, name: string, rfid: string) {
        return this.http.get(this.addEmployeeUrl+"?id=" + id + "&name=" + name + "&rfid=" + rfid)
            .toPromise()
            .then(res => res.text())
    }
    
    private extractData(res: Response) {
        let body = res.json()
        let data = body || { }
        return data
    }
}