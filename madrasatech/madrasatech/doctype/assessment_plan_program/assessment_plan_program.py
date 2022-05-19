# Copyright (c) 2022, MadrasaTech TEAM and contributors
# For license information, please see license.txt

from itertools import count
import frappe
from frappe import _
from frappe.model.document import Document
from madrasatech.madrasatech.api import get_student_group_students

class AssessmentPlanProgram(Document):
	def validate(self):
		self.validate_overlap()
		self.validate_max_score()
		# self.validate_assessment_criteria()

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
	
	# def on_submit(self):
	# 	self.create_assessment_result()

	# def create_assessment_result(self):
		# student = frappe.get_doc("Student", self.student)
		# course_list = [course.course for course in self.courses]
		# for course_name in course_list:
		# 	student.enroll_in_course(
		# 		course_name=course_name, program_enrollment=self.name, enrollment_date=self.enrollment_date
		# 	)
		# student_list = get_student_group_students(self.student_group)
		# count = 0
		# frappe.throw(_("You count {}").format(student_list.student))
		# for student in student_list:
			# pass
			# frappe.throw(_("You  {}").format(i))
			# frappe.msgprint(_("Result already Submitted{}").format())
			# doc = frappe.new_doc('Assessment Result Program')
			# doc.assessment_plan = self.name
			# doc.student = student.student
			# doc.student_group = self.student_group
			# doc.insert(ignore_permissions=True, ignore_links=True, ignore_if_duplicate=True,ignore_mandatory=True)
			# count +=1

			# frappe.msgprint(_("Result already Submitted{}").format(count))			
	
	# @frappe.whitelist()
	# def get_courses(self):
	# 	return frappe.db.sql(
	# 		"""select course from `tabProgram Course` where parent = %s and required = 1""",
	# 		(self.program),
	# 		as_dict=1,
	# 	)
