// Copyright (c) 2026, Sujal Jethava and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Tender", {
// 	refresh(frm) {

// 	},
// });


// frappe.ui.form.on('Tender BOQ Item', {
//     base_rate: function(frm, cdt, cdn) {
//         calculate_final_rate(frm, cdt, cdn);
//     },
//     margin: function(frm, cdt, cdn) {
//         calculate_final_rate(frm, cdt, cdn);
//     },
//     qty: function(frm, cdt, cdn) {
//         calculate_final_rate(frm, cdt, cdn);
//     }
// });

// function calculate_final_rate(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let base_rate = row.base_rate || 0;
//     let margin = row.margin || 0;
//     let qty = row.qty || 0;

//     // Final Rate = Base Rate + (Base Rate * Margin / 100)
//     let final_rate = base_rate * qty;

//     // Total = Qty * Final Rate
//     let total = qty * final_rate;

//     frappe.model.set_value(cdt, cdn, 'final_rate', final_rate);
//     frappe.model.set_value(cdt, cdn, 'total', total);
// }













// // Copyright (c) 2026, Sujal Jethava and contributors
// // For license information, please see license.txt

// // ─── Tender (Parent Form) ───────────────────────────────────────────
// frappe.ui.form.on("Tender", {
//     refresh: function(frm) {
//         calculate_extra_items_total(frm);
//     },

//     // Extra Items child table માં item_price change થાય ત્યારે
//     // (child table events parent form માં પણ catch થાય)
// });

// // ─── Extra Items Child Table ────────────────────────────────────────
// frappe.ui.form.on('Extra Items', {
//     item_price: function(frm, cdt, cdn) {
//         calculate_extra_items_total(frm);
//     },
//     gst: function(frm, cdt, cdn) {
//         calculate_extra_items_total(frm);
//     },
//     extra_items_remove: function(frm) {
//         calculate_extra_items_total(frm);
//     }
// });

// function calculate_extra_items_total(frm) {
//     let gst_percent = parseFloat(frm.doc.gst || 0);  // Parent form નું GST(%) field
//     let total_before_gst = 0;

//     // Extra Items ની બધી rows નો sum
//     (frm.doc.extra_items || []).forEach(function(row) {
//         total_before_gst += parseFloat(row.item_price || 0);
//     });

//     // GST add કરો
//     let gst_amount = total_before_gst * gst_percent / 100;
//     let total_amount = total_before_gst + gst_amount;

//     // Parent form ના total_amount field માં set કરો
//     frm.set_value('total_amount', total_amount);
// }

// // ─── BOQ Items Child Table ──────────────────────────────────────────
// frappe.ui.form.on('Tender BOQ Item', {
//     base_rate: function(frm, cdt, cdn) {
//         calculate_final_rate(frm, cdt, cdn);
//     },
//     qty: function(frm, cdt, cdn) {
//         calculate_final_rate(frm, cdt, cdn);
//     }
// });

// function calculate_final_rate(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let base_rate = parseFloat(row.base_rate || 0);
//     let qty       = parseFloat(row.qty || 0);

//     // Final Rate = Base Rate + 5% GST
//     let final_rate = base_rate + (base_rate * 5 / 100);

//     // Total = Qty * Final Rate
//     let total = qty * final_rate;

//     frappe.model.set_value(cdt, cdn, 'final_rate', final_rate);
//     frappe.model.set_value(cdt, cdn, 'total', total);
// }










// // Copyright (c) 2026, Sujal Jethava and contributors
// // For license information, please see license.txt

// frappe.ui.form.on("Tender", {
//     refresh: function(frm) {
//         calculate_extra_items_total(frm);
//     }
// });

// // ─── Extra Items Child Table ────────────────────────────────────────
// frappe.ui.form.on('Extra Items', {
//     item_price: function(frm, cdt, cdn) {
//         calculate_extra_items_total(frm);
//     },
//     gst: function(frm, cdt, cdn) {
//         calculate_extra_items_total(frm);
//     },
//     extra_items_remove: function(frm) {
//         calculate_extra_items_total(frm);
//     }
// });

// // Parent form GST field change થાય ત્યારે
// frappe.ui.form.on("Tender", {
//     gst: function(frm) {
//         calculate_extra_items_total(frm);
//     }
// });

// function calculate_extra_items_total(frm) {
//     let gst_percent = parseFloat(frm.doc.gst || 0);  // 18%
//     let total_before_gst = 0;

//     // Extra Items ની બધી rows નો sum
//     (frm.doc.extra_items || []).forEach(function(row) {
//         total_before_gst += parseFloat(row.item_price || 0);
//     });

//     // 18% GST add કરો
//     let gst_amount = total_before_gst * gst_percent / 100;
//     let total_amount = total_before_gst + gst_amount;  // 28,320

//     // Parent form ના total_amount field માં set કરો
//     frm.set_value('total_amount', total_amount);

//     // ─── BOQ Items માં Base Rate auto-set કરો ───────────────────
//     (frm.doc.boq_items || []).forEach(function(row) {
//         frappe.model.set_value(
//             row.doctype, row.name,
//             'base_rate', total_amount  // 28,320 → Base Rate
//         );
//     });

//     frm.refresh_field('boq_items');
// }

// // ─── BOQ Items Child Table ──────────────────────────────────────────
// frappe.ui.form.on('Tender BOQ Item', {
//     base_rate: function(frm, cdt, cdn) {
//         calculate_boq_final_rate(frm, cdt, cdn);
//     },
//     qty: function(frm, cdt, cdn) {
//         calculate_boq_final_rate(frm, cdt, cdn);
//     }
// });

// function calculate_boq_final_rate(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let base_rate = parseFloat(row.base_rate || 0);  // 28,320
//     let qty       = parseFloat(row.qty || 0);

//     // Final Rate = Base Rate + 5% GST
//     let final_rate = base_rate + (base_rate * 5 / 100);  // 29,736

//     frappe.model.set_value(cdt, cdn, 'final_rate', final_rate);
//     frm.refresh_field('boq_items');
// }












// Copyright (c) 2026, Sujal Jethava and contributors
// For license information, please see license.txt

frappe.ui.form.on("Tender", {
    refresh: function(frm) {
        calculate_extra_items_total(frm);
    },
    gst: function(frm) {
        calculate_extra_items_total(frm);
    }
});

// ─── Extra Items Child Table ────────────────────────────────────────
frappe.ui.form.on('Extra Items', {
    item_price: function(frm, cdt, cdn) {
        calculate_extra_items_total(frm);
    },
    extra_items_remove: function(frm) {
        calculate_extra_items_total(frm);
    }
});

function calculate_extra_items_total(frm) {
    let gst_percent = parseFloat(frm.doc.gst || 0);
    let total_before_gst = 0;

    (frm.doc.extra_items || []).forEach(function(row) {
        total_before_gst += parseFloat(row.item_price || 0);
    });

    let gst_amount = total_before_gst * gst_percent / 100;
    let total_amount = total_before_gst + gst_amount;

    frm.set_value('total_amount', total_amount);

    // BOQ Items માં Base Rate auto-set
    (frm.doc.boq_items || []).forEach(function(row) {
        frappe.model.set_value(row.doctype, row.name, 'base_rate', total_amount);
    });

    frm.refresh_field('boq_items');
}

// ─── BOQ Items Child Table ──────────────────────────────────────────
frappe.ui.form.on('Tender BOQ Item', {
    base_rate: function(frm, cdt, cdn) {
        calculate_boq_final_rate(frm, cdt, cdn);
    },
    qty: function(frm, cdt, cdn) {
        calculate_boq_final_rate(frm, cdt, cdn);
    }
});

function calculate_boq_final_rate(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    let base_rate  = parseFloat(row.base_rate || 0);
    let qty        = parseFloat(row.qty || 0);

    // Final Rate = Base Rate + 5% GST  (qty થી affect નહીં)
    let final_rate = base_rate + (base_rate * 5 / 100);

    // Total = Final Rate × Qty  ← નવું
    let total = final_rate * qty;

    frappe.model.set_value(cdt, cdn, 'final_rate', final_rate);
    frappe.model.set_value(cdt, cdn, 'total', total);  // ← નવું
    frm.refresh_field('boq_items');
}