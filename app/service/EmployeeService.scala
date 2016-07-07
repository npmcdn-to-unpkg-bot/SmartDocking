package service

import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.util.{Failure, Success, Try}
import weekplanning.model.User
import weekplanning.models._

trait EmployeeService {

  val db:JdbcProfile#Backend#Database
  val projects: TableQuery[ProjectTableDef]
  val employees = TableQuery[EmployeeTableDef]

  def createEmployeeSchema(): Unit ={
    db.run(employees.schema.create)
  }

  def getProjectOwner(pId: Int): Future[Option[User]]

  def getAllEmployeesForProject(projectId: Int) : Future[Seq[Employee]] = {
    val query = for {
        p <- projects if p.id === projectId
        e <- employees if p.id === e.projectId
    } yield e
    db.run(query.result)
  }

  def removeEmployee(id: Int, name: String, rfid: String): Future[Try[String]] = {
    db.run(employees.filter(x => x.name === name && x.projectId === id && x.rfid === rfid).delete).map(res => Success("ok")).recover{
      case ex: Exception => Failure( new Exception("There is no person with that name or rfid.") )
    }
  }

  def deleteAllEmployeesForProject(id: Int): Future[Try[String]] = {
    db.run(employees.filter(emp => emp.projectId === id).delete).map(_ => Success(""))
  }

  def addEmployee(emp: Employee) : Future[Try[String]] = {
    if(!Await.result(getAllEmployeesForProject(emp.projectId), Duration.Inf)
      .exists(_.name == emp.name))
      {
    Await.result(getProjectOwner(emp.projectId), Duration.Inf)
      .map{_ =>
        db.run(employees += emp).map(_ => Success("ok")).recover{
          case e:Exception => Failure(e)
        }
      }
      .getOrElse( Future { Failure { new Exception("Project does not exists.") } } )
  } else {
    Future { Failure(new Exception("That name is already in use.")) }
  }
  }

}
