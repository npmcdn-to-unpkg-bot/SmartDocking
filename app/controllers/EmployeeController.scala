package weekplanning.controllers

import play.api.libs.json.Json
import play.api.mvc.Controller
import service.DAL
import weekplanning.controllers.Secured
import weekplanning.models.{Employee, Level}

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

class EmployeeController extends Controller with Secured {

  def addEmployee(projectId: Int, name: String, rfid: String) =
    withAuth { username => implicit request =>
      val all = Await.result(DAL.getAllEmployeesForProject(projectId), Duration.Inf)
        .find(emp => emp.name == name || emp.rfid == rfid)
        .exists(_ => true)
      if(!all) {
        Await.result(DAL.usersProjects(username), Duration.Inf).find {
          case (pro, level) => (level == Level.Owner || level == Level.Write) && pro.id == projectId
        }.map { _ =>
          Await.result(DAL.addEmployee(Employee(name, projectId, rfid)), Duration.Inf)
          match {
            case Success(x) => Ok("ok")
            case Failure(e) => Ok(e.getMessage)
          }
        }.getOrElse(Ok("You don't have permission to edit this project."))
      } else {
        Ok("There is already a person with that name of tag.")
      }
  }

  def deleteEmployee(id: Int, name: String, rfid: String) =
    withAuth { username => implicit request =>
      Await.result(DAL.usersProjects(username), Duration.Inf).find{
        case (pro, _) => pro.id == id
      }.map{ _ =>
        Await.result(DAL.removeEmployee(id, name, rfid), Duration.Inf) match {
          case Success(x) => Ok("ok")
          case Failure(ex) => Ok(ex.getMessage)
        }
      }.getOrElse(Ok("You don't have permission to see this project."))
  }

  def listEmployees(id: Int) =
    withAuth { username => implicit request =>
      Await.result(DAL.usersProjects(username), Duration.Inf).find{
        case (pro, _) => pro.id == id
      }.map{ _ =>
        Ok(Json.toJson(Await.result(DAL.getAllEmployeesForProject(id), Duration.Inf)))
      }.getOrElse(Ok("You don't have permission to see this project."))
  }

}
