// Copyright (c) 2022, MadrasaTech TEAM and contributors
// For license information, please see license.txt

frappe.ui.form.on('Assessment Student', {
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
	// onload: function(frm) {
	// 	frm.set_query('program', function() {
	// 		return {
	// 			filters: {
				
	// 			}
	// 		};
	// 	});
	// },

	program: function(frm) {
		if (frm.doc.program) {
			frappe.call({
				method: 'madrasatech.madrasatech.api.get_assessment_courses_details',
				// method: 'get_courses',
				args: {
					program: frm.doc.program,
					plan:frm.doc.plan
				},
				callback: function(r) {
					if (r.message) {
						frappe.model.clear_table(frm.doc, 'details');
						$.each(r.message, function(i, d) {
							var row = frm.add_child('details');
							row.course = d.course;
							row.maximum_score = d.maximum_score;
						});
						frm.refresh_field('details');
					}
				}
			});
		}
	},

	// setup_chart: function(frm) {
	// 	let labels = [];
	// 	let maximum_scores = [];
	// 	let scores = [];
	// 	$.each(frm.doc.details, function(_i, e) {
	// 		labels.push(e.course);
	// 		maximum_scores.push(e.maximum_score);
	// 		scores.push(e.score);
	// 	});

	// 	if (labels.length && maximum_scores.length && scores.length) {
	// 		frm.dashboard.chart_area.empty().removeClass('hidden');
	// 		new frappe.Chart('.form-graph', {
	// 			title: 'Assessment Student',
	// 			data: {
	// 				labels: labels,
	// 				datasets: [
	// 					{
	// 						name: 'Maximum Score',
	// 						chartType: 'bar',
	// 						values: maximum_scores,
	// 					},
	// 					{
	// 						name: 'Score Obtained',
	// 						chartType: 'bar',
	// 						values: scores,
	// 					}
	// 				]
	// 			},
	// 			colors: ['#4CA746', '#98D85B'],
	// 			type: 'bar'
	// 		});
	// 	}
	// }
});

// frappe.ui.form.on('Assessment Student Detail', {
// 	score: function(frm, cdt, cdn) {
// 		var d  = locals[cdt][cdn];

// 		if (!d.maximum_score || !frm.doc.grading_scale) {
// 			d.score = '';
// 			frappe.throw(__('Please fill in all the details to generate Assessment Result.'));
// 		}

// 		if (d.score > d.maximum_score) {
// 			frappe.throw(__('Score cannot be greater than Maximum Score'));
// 		}
// 		else {
// 			frappe.call({
// 				method: 'madrasatech.madrasatech.api.get_grade',
// 				args: {
// 					grading_scale: frm.doc.grading_scale,
// 					percentage: ((d.score/d.maximum_score) * 100)
// 				},
// 				callback: function(r) {
// 					if (r.message) {
// 						frappe.model.set_value(cdt, cdn, 'grade', r.message);
// 					}
// 				}
// 			});
// 		}
// 	}
// });



	


