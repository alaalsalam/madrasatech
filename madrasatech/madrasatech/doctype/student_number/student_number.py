# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
from frappe import _, throw
from frappe.utils import random_string


class StudentNumber(Document):
    pass


@frappe.whitelist()
def get_students_list(std_group, program):
    filters = [program]
    cond = ''
    if std_group:
        cond += ' and sg.name=%s '
        filters.append(std_group)

    return frappe.db.sql("""select sgs.student, sgs.student_name, sg.program, sg.student_group_name
			from `tabStudent Group` sg
			LEFT JOIN  `tabStudent Group Student` sgs 
			ON sg.name=sgs.parent
			where sg.program=%s {0}
			""".format(cond), filters, as_dict=True)


@frappe.whitelist()
def fill_students(st_no, std_group=None, program=None):
    students = get_students_list(
        std_group, program)

    if not students:
        frappe.msgprint(_("No students for the mentioned Students group"))
    i = 1
    for std in students:
        std['exam_number'] = i
        std['secret_number'] = random_string(10)
        i += 1

    student_number = frappe.get_doc("Student Number", st_no)
    student_number.students = None
    for d in students:
        if d.student not in students:
            row = student_number.append('students', {})
            row.student_group = d.student_group_name
            row.student = d.student
            row.student_name = d.student_name
            row.secret_number = d.secret_number
            row.exam_number = d.exam_number
    student_number.save()