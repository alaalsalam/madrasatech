// Copyright (c) 2022, MadrasaTech TEAM and contributors
// For license information, please see license.txt


frappe.ui.form.on('Assessment Result Final', {
	refresh: function(frm) {
		if (!frm.doc.__islocal) {
			frm.trigger('setup_chart');
		}

		frm.get_field('details').grid.cannot_add_rows = true;

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
	onload: function(frm) {
		frm.set_query('assessment_plan', function() {
			return {
				filters: {
					docstatus: 1
				}
			};
		});
	},
	student: function(frm) {
		console.log("Hi Ala")
			

	
		if (frm.doc.assessment_plan) {
			frappe.call({
				method: 'madrasatech.madrasatech.api.get_assessment_details_program_all_course',
				args: {
					assessment_plan: frm.doc.assessment_plan
				},
				callback: function(r) {
					if (r.message) {
						frappe.model.clear_table(frm.doc, 'details');
						$.each(r.message, function(i, d) {
							var row = frm.add_child('details');
							row.assessment_criteria = d.assessment_criteria;
							row.maximum_score = d.maximum_score;
							
							frappe.call({
								method: 'madrasatech.madrasatech.api.get_final_result',
								
								args: {
									"student":frm.doc.student,
									"academic_year":frm.doc.academic_year,
									"assessment_criteria_program":d.assessment_criteria,


								},
								
								callback: function(r) {
									console.log("-->",r.message)
									if (r.message) {
										var sum = 0;
										if(r.message[0][0]){
											row.middle_score = (r.message[0][0].total_score);
											sum += row.middle_score;
										}
										if (r.message[1]){
											row.outcome1 = (r.message[1]);
											sum += row.outcome1;
										}
										if(r.message[2][0]){
											row.final_score = (r.message[2][0].total_score);
											sum += row.final_score;
										}
										if (r.message[3]){
											row.outcome2 = (r.message[3]);
											sum += row.outcome2;
										}

										row.score = sum;
										
									}
									else
										row.score = "";
										
									frm.refresh_field('details');
								}
							});

							
						});
						
					}
				}
			});
		}
		

	},


});
frappe.ui.form.on('Assessment Result Detail Final', {
	score: function(frm, cdt, cdn) {
		var d  = locals[cdt][cdn];

		if (!d.maximum_score || !frm.doc.grading_scale) {
			d.score = '';
			frappe.throw(__('Please fill in all the details to generate Assessment Result.'));
		}

		if (d.score > d.maximum_score) {
			frappe.throw(__('Score cannot be greater than Maximum Score'));
		}
		else {
			frappe.call({
				method: 'madrasatech.madrasatech.api.get_grade',
				args: {
					grading_scale: frm.doc.grading_scale,
					percentage: ((d.score/d.maximum_score) * 100)
				},
				callback: function(r) {
					if (r.message) {
						frappe.model.set_value(cdt, cdn, 'grade', r.message);
					}
				}
			});
		}
	}
});