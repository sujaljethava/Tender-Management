import frappe

@frappe.whitelist()
def get_dashboard_data():
    
    # Number Cards
    total = frappe.db.count("Tender")
    draft = frappe.db.count("Tender", {"status": "Draft"})
    qualified = frappe.db.count("Tender", {"status": "Qualified"})
    disqualified = frappe.db.count("Tender", {"status": "Disqualified"})
    submitted = frappe.db.count("Tender", {"status": "Submitted"})
    inprogress = frappe.db.count("Tender", {"status": "InProgress"})

    # Supplier Wise Chart
    supplier_data = frappe.db.sql("""
        SELECT supplier_name, COUNT(*) as count
        FROM `tabTender`
        WHERE supplier_name IS NOT NULL
        GROUP BY supplier_name
        ORDER BY count DESC
    """, as_dict=True)

    # Monthly Trend
    monthly_data = frappe.db.sql("""
        SELECT 
            DATE_FORMAT(creation, '%b %Y') as month,
            COUNT(*) as count
        FROM `tabTender`
        GROUP BY DATE_FORMAT(creation, '%Y-%m')
        ORDER BY creation ASC
        LIMIT 12
    """, as_dict=True)

    # Status Distribution
    status_data = frappe.db.sql("""
        SELECT status, COUNT(*) as count
        FROM `tabTender`
        GROUP BY status
    """, as_dict=True)

    return {
        "cards": {
            "total": total,
            "draft": draft,
            "qualified": qualified,
            "disqualified": disqualified,
            "submitted": submitted,
            "inprogress": inprogress,
        },
        "supplier_chart": {
            "labels": [d.supplier_name for d in supplier_data],
            "values": [d.count for d in supplier_data],
        },
        "monthly_chart": {
            "labels": [d.month for d in monthly_data],
            "values": [d.count for d in monthly_data],
        },
        "status_chart": {
            "labels": [d.status for d in status_data],
            "values": [d.count for d in status_data],
        }
    }