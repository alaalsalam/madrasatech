// Copyright (c) 2022, MadrasaTech TEAM and contributors
// For license information, please see license.txt
// var course_array ;
// function get_assessment_resulte_for_all_course(course_name , frm){
// 	// console.log(frm.doc);
	
// 	frappe.call({
// 		method: 'madrasatech.madrasatech.api.get_result_program_all_coures',
// 		args: {
// 			"student":frm.doc.student,
// 			"assessment_criteria_program":course_name,
// 			'type_test':frm.doc.type_test,
// 			"assessment_group":d.assessment_group
// 		},
// 		callback: function(r) {get_result_program_all_coures
// 			// console.log("result ->",r.message)
// 			if (r.message) {
// 				var msg = r.message;
// 				for( let i in msg){
// 					// course_array.push(r.message[i].total_score)
// 					console.log(typeof(msg[i].total_score));
// 					course_array = msg[i].total_score;

// 				}
// 				// console.log("result 1->",course_array)
// 				return 5;	
// 				// frm.refresh_field('details');
// 			}
// 			else
// 				return false;
// 		}
// 	});

// }
frappe.ui.form.on('Assessment Result Program', {
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
								method: 'madrasatech.madrasatech.api.get_result_program_all_coures',
								args: {
									"student":frm.doc.student,
									'academic_term': frm.doc.academic_term,
									"assessment_criteria_program":d.assessment_criteria,
									"assessment_group":frm.doc.assessment_group,
									'type_test':frm.doc.type_test,

								},
								callback: function(r) {
									if (r.message) {
											row.score = (r.message[0].total_score);
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

	setup_chart: function(frm) {
		let labels = [];
		let maximum_scores = [];
		let scores = [];

		

		$.each(frm.doc.details, function(_i, e) {
			labels.push(e.assessment_criteria);
			maximum_scores.push(e.maximum_score);
			if (e.score != 0)
				scores.push(e.score);
			else
				// frm.trigger('student');
				frappe.call({
					method: 'madrasatech.madrasatech.api.get_result_program_all_coures',
					args: {
						"student":frm.doc.student,
						'academic_year': frm.doc.academic_year,
						'academic_term':frm.doc.academic_term,
						'type_test':frm.doc.type_test,
						'assessment_criteria_program':e.assessment_criteria,
						"assessment_group":frm.doc.assessment_group
	
					},
					callback: function(r) {
						if (r.message) {
								scores.push(r.message[0].total_score);
								console.log(r.message[0].total_score);
							}
						
						else
							scores.push(0)
							
						frm.refresh_field('details');
					}
				});
			
		});

		// if (labels.length && maximum_scores.length && scores.length) {
		// 	frm.dashboard.chart_area.empty().removeClass('hidden');
		// 	new frappe.Chart('.form-graph', {
		// 		title: 'Assessment Results',
		// 		data: {
		// 			labels: labels,
		// 			datasets: [
		// 				{
		// 					name: 'Maximum Score',
		// 					chartType: 'bar',
		// 					values: maximum_scores,
		// 				},
		// 				{
		// 					name: 'Score Obtained',
		// 					chartType: 'bar',
		// 					values: scores,
		// 				}
		// 			]
		// 		},
		// 		colors: ['red', 'red'],
		// 		type: 'bar'
		// 	});
		// }
	}
});

frappe.ui.form.on('Assessment Result Detail Program', {
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


