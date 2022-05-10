# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
from frappe import _, throw
from frappe.utils import random_string


class StudentNumber(Document):
    pass


@frappe.whitelist()
def get_students_list(st_no, std_group, program, academic_term, student_category):
    filters = [program]
    cond = ''
    if std_group:
        cond += ' and sg.name=%s '
        filters.append(std_group)
    if academic_term:
        cond += ' and sg.academic_term=%s '
        filters.append(academic_term)
    if student_category:
        cond += ' and sg.student_category=%s '
        filters.append(student_category)

    return frappe.db.sql("""select sgs.student,sg.program, sg.academic_year, sg.name, sg.academic_term , sg.student_category
			from `tabStudent Group` sg
			LEFT JOIN  `tabStudent Group Student` sgs 
			ON sg.name=sgs.parent
			where sg.program=%s {0}
			
			""".format(cond), filters, as_dict=True)


@frappe.whitelist()
def fill_students(st_no, std_group=None, program=None, academic_term=None, student_category=None):
    students = get_students_list(
        st_no, std_group, program, academic_term, student_category)

    if not students:
        frappe.msgprint(_("No students for the mentioned type"))
    i = 1
    for std in students:
        std['exam_number'] = i
        std['secrete_number'] = random_string(10)
        i += 1
    # frappe.msgprint(frappe.as_json(students))
    # return students

    st_gr = frappe.get_doc("Student Number", st_no)
    st_gr.students = None
    for d in students:
        row = st_gr.append('students', {})
        row.student = d.student
        row.secrete_number = d.secrete_number
        row.exam_number = d.exam_number
    # frappe.msgprint(frappe.as_json(st_gr))
    st_gr.save()
    st_gr.reload()
