# Copyright (c) 2026, Sujal Jethava and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class TenderBOQItem(Document):
	pass



# import frappe
# from frappe.model.document import Document

# class TenderBOQItem(Document):
#     def validate(self):
#         # Final Rate = Base Rate + (Base Rate * Margin / 100)
#         if self.base_rate and self.margin:
#             self.final_rate = self.base_rate + (self.base_rate * self.margin / 100)
#         elif self.base_rate:
#             self.final_rate = self.base_rate
            
#         # Total = Qty * Final Rate
#         if self.qty and self.final_rate:
#             self.total = self.qty * self.final_rate