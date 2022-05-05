import frappe
def get_context(context):
     Instructor=frappe.db.sql("""SELECT name,instructor_name,image,designation,
     status FROM `tabInstructor`; """,as_dict=True)
     context.Instructor=Instructor
     return context