// Copyright (c) 2022, MadrasaTech TEAM and contributors
// For license information, please see license.txt
function get_total_scoer(student,course_name ,type_test){
	console.log(frm.doc);
	frappe.call({
		method: 'madrasatech.madrasatech.api.get_result_program_all_coures',
		args: {
			"student":student,
			"assessment_criteria_program":course_name,
			'type_test':type_test,
		},
		callback: function(r) {
			// console.log("result ->",r.message[0])
			if (r.message) {
				return r.message;
				// frm.refresh_field('details');
			}
			else
				return false;
		}
	});

}
frappe.ui.form.on('Assessment All Result Tool', {
	setup: function(frm) {
		frm.add_fetch("assessment_plan", "student_group", "student_group");
		frm.add_fetch("assessment_plan", "course", "course");
		frm.add_fetch("assessment_plan", "type_test", "type_test");
		frm.add_fetch("assessment_plan", "program", "program");
		frm.add_fetch("program", "stage", "stage");
	},

	refresh: function(frm) {	
		if (frappe.route_options) {
			frm.set_value("student_group", frappe.route_options.student_group);
			frm.set_value("assessment_plan", frappe.route_options.assessment_plan);
			frappe.route_options = null;
		} else {
			frm.trigger("assessment_plan");
		}
		frm.disable_save();
		frm.page.clear_indicator();

		frm.set_query('assessment_plan', function() {
			return {
				'filters':{
					'course': frm.doc.course,
					'type_test':frm.doc.type_test,
					'student_group':frm.doc.student_group,
					'program': frm.doc.program
				}
			};
		});
		frm.set_query('student_group', function() {
			return {
				'filters':{
					'program': frm.doc.program
				}
			};
		});
		frm.set_query('program', function() {
			return {
				'filters':{
					'stage': frm.doc.stage
				}
			};
		});

	},
	

	// course: function(frm) {
	// 	frm.set_value("assessment_plan", "");
	// },
	// type_test: function(frm) {
	// 	// frm.set_value("assessment_plan", "");
	// },
	
	// stage: function(frm){
	
	// 	if(frm.doc.assessment_plan) {
	// 		if (!frm.doc.student_group)
	// 			return
	// 		frappe.call({
	// 			method: "madrasatech.madrasatech.api.get_result_program_all_coures",
	// 			args: {
	// 				"student_group":frm.doc.student_group,
	// 				'type_test':frm.doc.type_test,
	// 			},
	// 			callback: function(r) {
	// 				console.log(r.message);
	// 								}
	// 		});
	// 	}
	// },
	assessment_plan: function(frm) {
		
		// console.log();
		frm.doc.show_submit = false;
		if(frm.doc.assessment_plan) {
			if (!frm.doc.student_group)
				return
			frappe.call({
				method: "madrasatech.madrasatech.api.get_assessment_students_program",
				args: {
					"assessment_plan": frm.doc.assessment_plan,
					'type_test':frm.doc.type_test,
					'student_group':frm.doc.student_group
					// "assessment_plan_coures": frappe.db.get_value(),
					// "assessment_plan_coures": frappe.db.get_value('Assessment Result', {
					// 						'academic_year': frm.doc.academic_year,
					// 						'academic_term':frm.doc.academic_term,
					// 						'student_group':frm.doc.student_group
					// 					},'assessment_plan'),

				},
				callback: function(r) {
					// console.log(r);
					console.log(r.message);
					if (r.message) {
						frm.doc.students = r.message;
						frm.events.render_table(frm);
						for (let value of r.message) {
							if (!value.docstatus) {
								frm.doc.show_submit = true;
								break;
							}
						}
						frm.events.submit_result(frm);
					}
				}
			});
		}
	},

	render_table: function(frm) {
		$(frm.fields_dict.result_html.wrapper).empty();
		let assessment_plan = frm.doc.assessment_plan;
		frappe.call({
			method: "madrasatech.madrasatech.api.get_assessment_details_program",
			args: {
				assessment_plan: assessment_plan
			},
			callback: function(r) {
				frm.events.get_marks(frm, r.message);
			}
		});
	},

	get_marks: function(frm, criteria_list) {
		let max_total_score = 0;
		criteria_list.forEach(function(c) {
			max_total_score += c.maximum_score
		});
		
		var result_table = $(frappe.render_template('assessment_result_tool_program', {
			frm: frm,
			students: frm.doc.students,
			criteria: criteria_list,
			max_total_score: max_total_score
		}));
		result_table.appendTo(frm.fields_dict.result_html.wrapper);
		result_table.on('change', 'input', function(e) {
			let $input = $(e.target);
			let student = $input.data().student;
			let max_score = $input.data().maxScore;
			let value = $input.val();
			if(value < 0) {
				$input.val(0);
			} else if(value > max_score) {
				$input.val(max_score);
			}
			let total_score = 0;
			let student_scores = {};
			student_scores["assessment_details"] = {}
			result_table.find(`input[data-student=${student}].student-result-data`)
				.each(function(el, input) {
					let $input = $(input);
					let criteria = $input.data().criteria; // input
					let value = parseFloat($input.val());
					if (!Number.isNaN(value)) {
						student_scores["assessment_details"][criteria] = value;
					} 
					else {
						pass;
					}// else
					total_score += value;
			});
			if(!Number.isNaN(total_score)) {
				result_table.find(`span[data-student=${student}].total-score`).html(total_score);
			}
			if (Object.keys(student_scores["assessment_details"]).length === criteria_list.length) {
				student_scores["student"] = student;
				student_scores["total_score"] = total_score;
				result_table.find(`[data-student=${student}].result-comment`)
					.each(function(el, input){
					student_scores["comment"] = $(input).val();
				});
				
				frappe.call({
					method: "madrasatech.madrasatech.api.mark_assessment_result_program",
					args: {
						"assessment_plan": frm.doc.assessment_plan,
						"scores": student_scores
						
					},
			
					callback: function(r) {
						let assessment_result = r.message;
						if (!frm.doc.show_submit) {
							frm.doc.show_submit = true;
							frm.events.submit_result;
						}
						for (var criteria of Object.keys(assessment_result.details)) {
							result_table.find(`[data-criteria=${criteria}][data-student=${assessment_result
								.student}].student-result-grade`).each(function(e1, input) {
									$(input).html(assessment_result.details[criteria]);
							});
						}
						result_table.find(`span[data-student=${assessment_result.student}].total-score-grade`).html(assessment_result.grade);
						let link_span = result_table.find(`span[data-student=${assessment_result.student}].total-result-link`);
						$(link_span).css("display", "block");
						$(link_span).find("a").attr("href", "/app/assessment-result-program/"+assessment_result.name);
					}
				});
			}
		});
	},

	submit_result: function(frm) {
		if (frm.doc.show_submit) {
			frm.page.set_primary_action(__("Submit"), function() {
				frappe.call({
					method: "madrasatech.madrasatech.api.submit_assessment_results_program",
					args: {
						"assessment_plan": frm.doc.assessment_plan,
						"student_group": frm.doc.student_group
					},
					callback: function(r) {
						if (r.message) {
							frappe.msgprint(__("{0} Result submittted", [r.message]));
						} else {
							frappe.msgprint(__("No Result to submit"));
						}
						frm.events.assessment_plan(frm);
					}
				});
			});
		}
		else {
			frm.page.clear_primary_action();
		}
	}
});
