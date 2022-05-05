# Copyright (c) 2022, MadrasaTech TEAM and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class AssessmentCourses(Document):
	def validate(self):
		self.validate_duplication()
		self.validate_academic_year()
		if self.academic_term:
			self.validate_academic_term()
		if not self.student_name:
			self.student_name = frappe.db.get_value("Student", self.student, "title")
		if not self.courses:
			self.extend("courses", self.get_courses())

			
	@frappe.whitelist()
	def get_courses(self):
		return frappe.db.sql(
			"""select course from `tabProgram Course` where parent = %s and required = 1""",
			(self.program),
			as_dict=1,
		)
