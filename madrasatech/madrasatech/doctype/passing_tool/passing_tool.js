// Copyright (c) 2022, MadrasaTech TEAM and contributors
// For license information, please see license.txt

frappe.ui.form.on('Passing Tool', {
	setup: function(frm) {
		frm.add_fetch("student", "title", "student_name");
	},

	"refresh": function(frm) {
		frm.disable_save();
		frm.fields_dict.enroll_students.$input.addClass(' btn btn-primary');
		frappe.realtime.on("passing_tool", function(data) {
			frappe.hide_msgprint(true);
			frappe.show_progress(__("Enrolling students"), data.progress[0], data.progress[1]);
		});
	},
	"get_students": function(frm) {
		frm.set_value("students",[]);
		frappe.call({
			method: "get_students",
			doc:frm.doc,
			callback: function(r) {
				if(r.message) {
					console.log(r.message);
					frm.set_value("students", r.message[0]);
					frm.set_value("new_student_batch", r.message[1]);
					frm.set_value("new_program", r.message[2]);
					frm.set_value("new_academic_year", r.message[3]);
				}
			}
		});
	},

	"enroll_students": function(frm) {
		frappe.call({
			method: "enroll_students",
			doc:frm.doc,
			callback: function(r) {
				frm.set_value("students", []);
				frappe.hide_msgprint(true);
			}
		});
	}
});

