
from . import __version__ as app_version

app_name = "madrasatech"
app_title = "madrasatech"
app_publisher = "MadrasaTech TEAM"
app_description = "An ERPNext app for managing schools"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "madrasatech@school.edu"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/madrasatech/css/madrasatech.css"
# app_include_js = "/assets/madrasatech/js/madrasatech.js"

# include js, css files in header of web template
# web_include_css = "/assets/madrasatech/css/madrasatech.css"
# web_include_js = "/assets/madrasatech/js/madrasatech.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "madrasatech/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}
app_logo_url = "/assets/madrasatech/images/madrasatech_logo.png"
website_context = {
    "favicon": "/assets/madrasatech/images/madrasatech_logo.png",
	"splash_image": "/assets/madrasatech/images/madrasatech_logo.png"
}
# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "madrasatech.install.before_install"
# after_install = "madrasatech.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "madrasatech.uninstall.before_uninstall"
# after_uninstall = "madrasatech.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "madrasatech.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"madrasatech.tasks.all"
# 	],
# 	"daily": [
# 		"madrasatech.tasks.daily"
# 	],
# 	"hourly": [
# 		"madrasatech.tasks.hourly"
# 	],
# 	"weekly": [
# 		"madrasatech.tasks.weekly"
# 	]
# 	"monthly": [
# 		"madrasatech.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "madrasatech.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "madrasatech.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "madrasatech.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
    {
        "doctype": "{doctype_1}",
        "filter_by": "{filter_by}",
        "redact_fields": ["{field_1}", "{field_2}"],
        "partial": 1,
    },
    {
        "doctype": "{doctype_2}",
        "filter_by": "{filter_by}",
        "partial": 1,
    },
    {
        "doctype": "{doctype_3}",
        "strict": False,
    },
    {
        "doctype": "{doctype_4}"
    }
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"madrasatech.auth.validate"
# ]

# for reference
fixtures = [
        # "Program",
        # "Course",
        # "Student Applicant",
        # "Student Admission",
        # # "Program Enrollment",
        # # "Student",
        # "Education Settings",
        # "Accounts Settings",
        # "Student Category",
        # "Grading Scale",
        # # "Academic Year",
        # # "Academic Term",
        # "Fee Category",
        # # "Assessment Group",
        # "Client Script",
        # "Fee Category",
        # "Payment Request",
        # "Course Enrollment",
        # "Gender",
        # "Instructor",
        # "Workspace",
        
    {"dt": "Custom Field", "filters": [
        [
            "dt", "in", [
                "Academic Year",
                "Academic Term",
                "Student",
                "Student Group",
                "Program",
                "Room",
                "Student Applicant",
                "Program Enrollment",
                "Fee Structure",
                "Instructor",
                "Assessment Plan",
                "Assessment Result",
                "Assessment Criteria",
                "Instructor",
                "Workspace",
                
            ]
        ]
    ]},
    {"dt": "Property Setter", "filters": [
        [
            "doc_type", "in", [
                "Academic Year",
                "Academic Term",
                "Student",
                "Student Group",
                "Program",
                "Student Applicant",
                "Program Enrollment",
                "Room",
                "Student Batch Name",
                "Instructor",
                "Assessment Plan",
                "Assessment Result",
                "Course",
                "Assessment Criteria",
                "Instructor",
                "Workspace",
            ]
        ]]
     }]
