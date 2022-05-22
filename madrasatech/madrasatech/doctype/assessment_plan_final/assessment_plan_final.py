# Copyright (c) 2022, MadrasaTech TEAM and contributors
# For license information, please see license.txt

# import frappe
from itertools import count
import frappe
from frappe import _
from frappe.model.document import Document
from madrasatech.madrasatech.api import get_student_group_students


class AssessmentPlanFinal(Document):
	def validate(self):
		self.validate_overlap()
		self.validate_max_score()
	
	def validate_overlap(self):
		"""Validates overlap for Student Group, Instructor, Room"""

		from erpnext.education.utils import validate_overlap_for
	
	def validate_max_score(self):
		max_score = 0
		for d in self.assessment_coursrs:
			max_score += d.maximum_score
		if self.maximum_assessment_score != max_score:
			frappe.throw(
				_("Sum of Scores of Assessment Criteria needs to be {0}.").format(
					self.maximum_assessment_score
				)
			)
	def max_score(self):
		max_score = 0
		for d in self.assessment_coursrs:
			max_score += d.maximum_score
		maximum_assessment_score = max_score
		

	def validate_max_score(self):
		max_score = 0
		for d in self.assessment_coursrs:
			max_score += d.maximum_score
		if self.maximum_assessment_score != max_score:
			frappe.throw(
				_("Sum of Scores of Assessment Criteria needs to be {0}.").format(
					self.maximum_assessment_score
				)
			)
			
	def validate_assessment_criteria(self):
		assessment_criteria_list = frappe.db.sql_list(
			""" select apc.assessment_criteria
			from `tabAssessment Plan` ap , `tabAssessment Plan Criteria` apc
			where ap.name = apc.parent and ap.course=%s and ap.student_group=%s and ap.assessment_group=%s
			and ap.name != %s and ap.docstatus=1""",
			(self.course, self.student_group, self.assessment_group, self.name),
		)
		for d in self.assessment_criteria:
			if d.assessment_criteria in assessment_criteria_list:
				frappe.throw(
					_("You have already assessed for the assessment criteria {}.").format(
						frappe.bold(d.assessment_criteria)
					)
				)
	@frappe.whitelist()
	def get_courses(self):
		return frappe.db.sql(
			"""select course from `tabProgram Course` where parent = %s and required = 1""",
			(self.program),
			as_dict=1,
		)