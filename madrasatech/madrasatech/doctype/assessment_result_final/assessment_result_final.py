# Copyright (c) 2022, MadrasaTech TEAM and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import flt
from frappe.utils.csvutils import getlink

import erpnext.education
from madrasatech.madrasatech.api import get_assessment_details_program, get_grade

class AssessmentResultFinal(Document):
	def validate(self):
		erpnext.education.validate_student_belongs_to_group(self.student, self.student_group)
		self.validate_maximum_score()
		self.validate_grade()
		
		self.validate_duplicate()

	def validate_maximum_score(self):
		assessment_details = get_assessment_details_program(self.assessment_plan)
		max_scores = {}
		for d in assessment_details:
			max_scores.update({d.assessment_criteria: d.maximum_score})

		for d in self.details:
			d.maximum_score = max_scores.get(d.assessment_criteria)
			if d.score:
				if d.score > d.maximum_score:
					frappe.throw(_("Score cannot be greater than Maximum Score"))

			

	def validate_grade(self):
		self.total_score = 0.0
		passed = False
		for d in self.details:
			d.grade = get_grade(self.grading_scale, (flt(d.score) / d.maximum_score) * 100)
			if d.score:
				self.total_score += d.score
				if d.score < 50:
					passed = True
			if (self.total_score < self.maximum_score / 2)  or passed:
				self.grade_final = "راسب"
			else:
				self.grade_final = "ناجح"
				
		self.grade = get_grade(self.grading_scale, (self.total_score / self.maximum_score) * 100)
	


	def validate_duplicate(self):
		assessment_result = frappe.get_list(
			"Assessment Result",
			filters={
				"name": ("not in", [self.name]),
				"student": self.student,
				"assessment_plan": self.assessment_plan,
				"docstatus": ("!=", 2),
			},
		)
		if assessment_result:
			frappe.throw(
				_("Assessment Result record {0} already exists.").format(
					getlink("Assessment Result", assessment_result[0].name)
				)
			)

