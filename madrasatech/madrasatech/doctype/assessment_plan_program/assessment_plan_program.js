// Copyright (c) 2022, MadrasaTech TEAM and contributors
// For license information, please see license.txt

frappe.ui.form.on('Assessment Plan Program', {
	onload: function(frm) {
		frm.set_query('assessment_group', function(doc, cdt, cdn) {
			return{
				filters: {
					'is_group': 0
				}
			};
		});
		frm.set_query('grading_scale', function(){
			return {
				filters: {
					docstatus: 1
				}
			};
		});
	},
	refresh: function(frm) {
		if (frm.doc.docstatus == 1) {
			frm.add_custom_button(__('Assessment Result Tool'), function() {
				frappe.route_options = {
					assessment_plan: frm.doc.name,
					student_group: frm.doc.student_group
				}
				frappe.set_route('Form', 'Assessment Result Program Tool');
			}, __('Tools'));
		}

		

		frm.set_query('course', function() {
			return {
				query: 'erpnext.education.doctype.program_enrollment.program_enrollment.get_program_courses',
				filters: {
					'program': frm.doc.program
				}
			};
		});

		frm.set_query('academic_term', function() {
			return {
				filters: {
					'academic_year': frm.doc.academic_year
				}
			};
		});
	},

	type_test:function(frm){
		 frm.events.get_courses(frm);		
	},
	
	
	get_courses: function(frm) {
		frm.set_value('assessment_coursrs',[]);
		
		frappe.call({
			method: 'get_courses',
			doc:frm.doc,
			callback: function(r) {
				if (r.message) {
					console.log(r.message);
					let max_score = 0;
					let course = r.message;
					course.forEach((c) => {
						console.log(typeof(c));
						c.assessment_criteria = c.course;
						c.maximum_score = frm.doc.maximum_score_program;
						max_score += frm.doc.maximum_score_program
						delete c.course;
					});

					frm.set_value('assessment_coursrs', course);
					frm.set_value('maximum_assessment_score', max_score);
				}
			}
		})
	},

	// maximum_assessment_score: function(frm) {
	// 	frm.trigger('course');
	// },
	// course: function(frm) {
	// 	if (frm.doc.course && frm.doc.maximum_assessment_score) {
	// 		frappe.call({
	// 			method: 'madrasatech.madrasatech.api.get_assessment_criteria',
	// 			args: {
	// 				course: frm.doc.course
	// 			},
	// 			callback: function(r) {
	// 				if (r.message) {
	// 					frm.doc.assessment_criteria = [];
	// 					$.each(r.message, function(i, d) {
	// 						var row = frappe.model.add_child(frm.doc, 'Assessment Plan Criteria', 'assessment_criteria');
	// 						row.assessment_criteria = d.assessment_criteria;
	// 						row.maximum_score = d.weightage / 100 * frm.doc.maximum_assessment_score;
	// 					});
	// 				}
	// 				refresh_field('assessment_criteria');

	// 			}
	// 		});
	// 	}
	// },
});
