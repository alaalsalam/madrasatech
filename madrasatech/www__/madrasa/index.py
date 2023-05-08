import frappe
def get_context(context):
     Instructor=frappe.db.sql("""SELECT name,instructor_name,image,
     designation,
     status FROM `tabInstructor`; """,as_dict=True)
     context.Instructor=Instructor
     return context









     # SELECT `tabProgram Enrollment`.`student_name`,`tabProgram Enrollment`.`program`,`tabStudent Group`.`program` from `tabProgram Enrollment` inner join `tabStudent Group` on `tabStudent Group`.`program`=`tabProgram Enrollment`.`program`;
