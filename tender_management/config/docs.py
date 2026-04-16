# apps/tender_management/tender_management/config/docs.py

from frappe import _

def get_data():
    return [
        {
            "label": _("Tender"),
            "items": [
                {
                    "type": "doctype",
                    "name": "Tender",
                    "label": _("Tender"),
                    "description": _("Manage Tenders")
                },
                {
                    "type": "doctype", 
                    "name": "Tender BOQ Item",
                    "label": _("Tender BOQ Item"),
                },
            ]
        },
        {
            "label": _("Reports"),
            "items": [
                {
                    "type": "report",
                    "name": "Taro Report Name",  # exact report name
                    "label": _("Tender Report"),
                    "doctype": "Tender",
                    "is_query_report": True
                }
            ]
        }
    ]