// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Student Number', {
	refresh: function (frm) {
		if (!frm.is_new())
			frm.set_df_property("generate_numbers", "hidden");
	},
	generate_numbers: function (frm) {
		frm.events.fill_students(frm);

	},


	fill_students: function (frm) {
		return frappe.call({
			method: 'madrasatech.madrasatech.doctype.student_number.student_number.fill_students',
			args: {
				st_no: frm.doc.name,
				academic_year: frm.doc.academic_year
			},
			callback: function (msg) {
				refresh_field("students");
				frm.refresh();
				frm.save();
			}
		});
	}
});
