# apps/tender_management/tender_management/config/desktop.py

from frappe import _

def get_data():
    return [
        {
            "module_name": "Tender Management",
            "color": "#1abc9c",
            "icon": "octicon octicon-file-text",
            "type": "module",
            "label": _("Tender Management")
        }
    ]