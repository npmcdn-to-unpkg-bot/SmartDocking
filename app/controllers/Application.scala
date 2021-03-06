package weekplanning.controllers

import play.api.mvc
import play.api.mvc.{Action, Controller}
import service.DAL

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration
import weekplanning._
import weekplanning.models.Employee

class Application extends Controller with Secured {

  def test = Action {
/*    DAL.createUserSchema()
    DAL.createProjectSchema()
    DAL.createCollaboratesSchema()
    DAL.createEmployeeSchema()*/
    DAL.addEmployee(Employee("zander", 1, "test"))
    Ok("schema created.")
  }

  def index = withAuth { username => implicit request =>
    Redirect(routes.Application.projects())
  }

  def projects = withAuth { username => implicit request =>
    Ok(views.html.projects(Global.name, "Projects", Global.menu))
  }

}
