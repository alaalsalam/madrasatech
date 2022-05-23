# Copyright (c) 2015, Frappe Technologies and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document
from frappe import _, throw
from frappe.utils import random_string


from erpnext.education.utils import validate_duplicate_student

"""
It returns the number of students registered in a certain program 
"""


@frappe.whitelist()
def get_number_of_students_in_program(program):

    students_enrollment = frappe.get_list('Program Enrollment',
                                          filters={"program": program})
    number_of_students = len(students_enrollment)
    doc = frappe.get_doc('Program', program)
    doc.total_number_of_students = number_of_students
    doc.students_out_of_groups = number_of_students - doc.index_of_students_in_groups
    doc.save()
    return number_of_students
