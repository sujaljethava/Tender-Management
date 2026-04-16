# import frappe

# @frappe.whitelist()
# def get_pending_emd_tenders():
#     return frappe.get_list(
#         'Tender',
#         filters={'status': 'Disqualified'},
#         fields=['name', 'tender_id', 'title', 'district', 'emd'],  # 👈 ADD THIS
#         order_by='creation desc'
#     )


import frappe

@frappe.whitelist()
def get_pending_emd_tenders():
    return frappe.get_list(
        'Tender',
        filters={
            'status': 'Disqualified',
            'emd_received': 0   # 👈 ADD THIS LINE
        },
        fields=['name', 'tender_id', 'title', 'district', 'emd'],
        order_by='creation desc'
    )
    
    
@frappe.whitelist()
def mark_emd_received(tender_name):
    frappe.db.set_value('Tender', tender_name, 'emd_received', 1)
    frappe.db.commit()
    return "success"