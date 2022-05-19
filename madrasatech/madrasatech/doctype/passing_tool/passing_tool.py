# Copyright (c) 2022, MadrasaTech TEAM and contributors
# For license information, please see license.txt

# import frappe
from erpnext.education.api import enroll_student
from frappe.utils import cint
from frappe import _
import frappe
from frappe.model.document import Document


class Passingtool(Document):
    @frappe.whitelist()
    def get_students(self):
        students = []
        if not self.student_batch:
            frappe.throw(_("Mandatory field - Student Batch"))
        elif not self.program:
            frappe.throw(_("Mandatory field - Program"))
        elif not self.academic_year:
            frappe.throw(_("Mandatory field - Academic Year"))
        else:

            condition = "and student_batch_name=%(student_batch)s"
            students = frappe.db.sql(
                """select student, student_name, student_batch_name, student_category from `tabProgram Enrollment`
					where program=%(program)s and academic_year=%(academic_year)s {0} and docstatus != 2""".format(
                    condition
                ),
                self.as_dict(),
                as_dict=1,
            )

            student_list = [d.student for d in students]
            if student_list:
                inactive_students = frappe.db.sql(
                    """
						select name as student, title as student_name from `tabStudent` where name in (%s) and enabled = 0"""
                    % ", ".join(["%s"] * len(student_list)),
                    tuple(student_list),
                    as_dict=1,
                )

                for student in students:
                    if student.student in [d.student for d in inactive_students]:
                        students.remove(student)

        if students:
            program_abbreviation = frappe.db.get_value('Program', self.program, 'program_abbreviation')
            program_name, stage = frappe.db.get_value('Program', {'program_abbreviation': int(program_abbreviation) + 1}, ['program_name', 'stage'])
            return students, program_name, stage
        else:
            frappe.throw(_("No students Found"))

    @frappe.whitelist()
    def enroll_students(self):
        if not self.new_student_batch:
            frappe.throw(_("Mandatory field - New Student Batch"))
        elif not self.new_program:
            frappe.throw(_("Mandatory field - New Program"))
        elif not self.new_academic_year:
            frappe.throw(_("Mandatory field - New Academic Year"))
        else:
            total = len(self.students)
            for i, stud in enumerate(self.students):
                frappe.publish_realtime(
                    "passing_tool", dict(progress=[i + 1, total]), user=frappe.session.user
                )
                if stud.student:
                    prog_enrollment = frappe.new_doc("Program Enrollment")
                    prog_enrollment.student = stud.student
                    prog_enrollment.student_name = stud.student_name
                    prog_enrollment.program = self.new_program
                    prog_enrollment.academic_year = self.new_academic_year
                    prog_enrollment.student_batch_name = stud.new_student_batch
                    prog_enrollment.save()
            frappe.msgprint(_("{0} Students have been enrolled").format(total))
