package weekplanning.models

import play.api.libs.json.Json
import slick.driver.PostgresDriver.api._

case class Employee(name: String, projectId: Int, rfid: String)

object Employee{
  def tupled(tup:(String, Int, String)) = Employee(tup._1, tup._2, tup._3)

  implicit val employeeFormats = Json.format[Employee]
}

class EmployeeTableDef(tag: Tag) extends Table[Employee](tag, "employee") {

  def name = column[String]("name", O.PrimaryKey)
  def projectId = column[Int]("projectId")
  def rfid = column[String]("rfid")

  def fkToProject = foreignKey("project_fk", projectId, TableQuery[ProjectTableDef])(_.id, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

  def pk = primaryKey("pk", (name, projectId))

  override def * =
    (name, projectId, rfid) <>(Employee.tupled, Employee.unapply)
}
