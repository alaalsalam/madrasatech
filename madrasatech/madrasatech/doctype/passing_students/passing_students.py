# Copyright (c) 2022, MadrasaTech TEAM and contributors
# For license information, please see license.txt

# import frappe
from erpnext.education.api import enroll_student
from frappe.utils import cint
from frappe import _
import frappe
from frappe.model.document import Document
import datetime as dt


class PassingStudents(Document):
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
            condition = "and pe.student_batch_name=%(student_batch)s"
            condition2 = "and pe.student = arf.student"
            students = frappe.db.sql(
                """select pe.student, pe.student_name, pe.student_batch_name, arf.grade as status from `tabProgram Enrollment` pe, `tabAssessment Result Final` arf
					where pe.program=%(program)s and pe.academic_year=%(academic_year)s {0} {1} and pe.docstatus != 2""".format(
                    condition, condition2
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
            year = frappe.db.get_value('Academic Year', {'year_start_date':  self.get_date()})
            return students, stage, program_name, year, self.get_date()
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
                    "passing_students", dict(progress=[i + 1, total]), user=frappe.session.user
                )
                if stud.student:
                    prog_enrollment = frappe.new_doc("Program Enrollment")
                    prog_enrollment.student = stud.student
                    prog_enrollment.student_name = stud.student_name
                    if stud.status != "راسب":
                        prog_enrollment.program = self.new_program
                        prog_enrollment.student_batch_name = self.new_student_batch
                        prog_enrollment.student_category = "ناجح"
                    else:
                        prog_enrollment.program = self.program
                        prog_enrollment.student_batch_name = self.student_batch
                        prog_enrollment.student_category = "راسب"

                    prog_enrollment.academic_year = self.new_academic_year

                    if self.get_date().year >= dt.date.today().year:
                        prog_enrollment.enrollment_date = self.get_date()
                    else:
                        prog_enrollment.enrollment_date = dt.date.today()
                    prog_enrollment.save()
            frappe.msgprint(_("{0} Students have been enrolled").format(total))

    def get_date(self):
        year_start_date = frappe.db.get_value('Academic Year', {'academic_year_name':self.academic_year}, 'year_start_date')
        year_start_date = year_start_date.replace(year = year_start_date.year + 1)
        return year_start_date
