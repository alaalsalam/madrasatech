# Copyright (c) 2022, MadrasaTech TEAM and Contributors
# See license.txt

# import frappe
import unittest

class TestAssessmentResultProgram(unittest.TestCase):
	def test_grade(self):
		grade = get_grade("_Test Grading Scale", 80)
		self.assertEqual("جيد جدا", grade)

		grade = get_grade("_Test Grading Scale", 70)
		self.assertEqual("جيد", grade)
