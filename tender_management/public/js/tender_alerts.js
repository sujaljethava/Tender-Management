// frappe.after_ajax(function() {
//     if (!sessionStorage.getItem('tender_alert_shown')) {
//         check_tender_due_dates();
//     }
// });

// function check_tender_due_dates() {
//     frappe.call({
//         method: 'frappe.client.get_list',
//         args: {
//             doctype: 'Tender',
//             filters: [
//                 ['due_date', 'like', frappe.datetime.add_days(frappe.datetime.get_today(), 1) + '%']
//             ],
//             fields: ['name', 'title', 'due_date', 'supplier_name', 'emd'],
//             limit: 50
//         },
//         callback: function(r) {
//             if (r.message && r.message.length > 0) {
//                 let rows = r.message.map(t => `
//                     <tr>
//                         <td><b>${t.name}</b></td>
//                         <td>${t.title || ''}</td>
//                         <td>${t.due_date}</td>
//                         <td>${t.supplier_name || ''}</td>
//                         <td>₹${t.emd || ''}</td>
//                     </tr>
//                 `).join('');

//                 frappe.msgprint({
//                     title: '⚠️ Tender Due Date Reminder',
//                     message: `
//                         <table border="1" cellpadding="6" 
//                             style="width:100%;border-collapse:collapse">
//                             <thead style="background:#fff3cd">
//                                 <tr>
//                                     <th>Tender ID</th>
//                                     <th>Title</th>
//                                     <th>Due Date</th>
//                                     <th>Supplier</th>
//                                     <th>EMD</th>
//                                 </tr>
//                             </thead>
//                             <tbody>${rows}</tbody>
//                         </table>
//                         <br>
//                         <span style="color:red;font-weight:bold;font-size:14px;">
//                             Kal due date che! Badha documents submit karo.
//                         </span>
//                     `,
//                     indicator: 'orange'
//                 });

//                 sessionStorage.setItem('tender_alert_shown', 'true');
//             }
//         }
//     });
// }










// // Har 5 minute pe check karo
// setInterval(checkTenderAlerts, 5 * 60 * 1000);

// // Page load pe bhi check karo
// frappe.after_ajax(function() {
//     checkTenderAlerts();
// });

// function checkTenderAlerts() {
//     const now = new Date().getTime();

//     // Check karo ke user e "1 hour baad" choose kyu htu?
//     const remindAt = localStorage.getItem('tender_remind_at');
//     if (remindAt && now < parseInt(remindAt)) return; // Haju time nathi aavyo

//     // Custom time check
//     const customTime = localStorage.getItem('tender_custom_remind_at');
//     if (customTime && now < parseInt(customTime)) return; // Custom time nathi aavyi

//     // API call karo
//     frappe.call({
//         method: 'frappe.client.get_list',
//         args: {
//             doctype: 'Tender',
//             filters: [
//                 ['due_date', 'like', frappe.datetime.add_days(frappe.datetime.get_today(), 1) + '%']
//             ],
//             fields: ['name', 'title', 'due_date', 'supplier_name', 'emd'],
//             limit: 50
//         },
//         callback: function(r) {
//             if (r.message && r.message.length > 0) {
//                 showTenderAlert(r.message);
//             }
//         }
//     });
// }

// function showTenderAlert(tenders) {
//     let rows = tenders.map(t => `
//         <tr>
//             <td><b>${t.name}</b></td>
//             <td>${t.title || ''}</td>
//             <td>${t.due_date}</td>
//             <td>${t.supplier_name || ''}</td>
//             <td>₹${t.emd || ''}</td>
//         </tr>
//     `).join('');

//     // Popup banavo
//     let d = new frappe.ui.Dialog({
//         title: '⚠️ Tender Due Date Reminder',
//         fields: [
//             {
//                 fieldtype: 'HTML',
//                 fieldname: 'tender_table',
//                 options: `
//                     <table border="1" cellpadding="6" 
//                         style="width:100%;border-collapse:collapse;margin-bottom:15px">
//                         <thead style="background:#fff3cd">
//                             <tr>
//                                 <th>Tender ID</th>
//                                 <th>Title</th>
//                                 <th>Due Date</th>
//                                 <th>Supplier</th>
//                                 <th>EMD</th>
//                             </tr>
//                         </thead>
//                         <tbody>${rows}</tbody>
//                     </table>
//                     <p style="color:red;font-weight:bold;font-size:14px;">
//                         Kal due date che! Badha documents submit karo.
//                     </p>
//                 `
//             },
//             {
//                 fieldtype: 'Datetime',
//                 fieldname: 'custom_remind_time',
//                 label: 'Custom Reminder Time',
//                 description: 'Aa time par alert aavse'
//             }
//         ],
//         primary_action_label: '🔔 Remind in 1 Hour',
//         primary_action: function() {
//             // 1 hour baad time set karo
//             const oneHourLater = new Date().getTime() + (60 * 60 * 1000);
//             localStorage.setItem('tender_remind_at', oneHourLater);
//             localStorage.removeItem('tender_custom_remind_at');
//             frappe.show_alert({
//                 message: '1 Hour baad reminder aavse!',
//                 indicator: 'green'
//             });
//             d.hide();
//         },
//         secondary_action_label: '⏰ Set Custom Time',
//         secondary_action: function() {
//             const customTime = d.get_value('custom_remind_time');
//             if (!customTime) {
//                 frappe.show_alert({
//                     message: 'Pehla time select karo!',
//                     indicator: 'red'
//                 });
//                 return;
//             }
//             // Custom time localStorage ma save karo
//             const customTimestamp = new Date(customTime).getTime();
//             localStorage.setItem('tender_custom_remind_at', customTimestamp);
//             localStorage.removeItem('tender_remind_at');
//             frappe.show_alert({
//                 message: `Reminder set thayu: ${customTime}`,
//                 indicator: 'green'
//             });
//             d.hide();
//         }
//     });

//     d.show();
// }













// Check every 5 minutes
setInterval(checkTenderAlerts, 5 * 60 * 1000);

// Also check on page load
frappe.after_ajax(function() {
    checkTenderAlerts();
});

function checkTenderAlerts() {
    const now = new Date().getTime();

    // Check if "Remind after 1 hour" is set
    const remindAt = localStorage.getItem('tender_remind_at');
    if (remindAt && now < parseInt(remindAt)) return; // Not time yet

    // Check custom reminder time
    const customTime = localStorage.getItem('tender_custom_remind_at');
    if (customTime && now < parseInt(customTime)) return; // Not time yet

    // API call
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Tender',
            filters: [
                ['due_date', 'like', frappe.datetime.add_days(frappe.datetime.get_today(), 1) + '%']
            ],
            fields: ['name', 'title', 'due_date', 'supplier_name', 'emd'],
            limit: 50
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                showTenderAlert(r.message);
            }
        }
    });
}

function showTenderAlert(tenders) {
    let rows = tenders.map(t => `
        <tr>
            <td><b>${t.name}</b></td>
            <td>${t.title || ''}</td>
            <td>${t.due_date}</td>
            <td>${t.supplier_name || ''}</td>
            <td>₹${t.emd || ''}</td>
        </tr>
    `).join('');

    // Create popup
    let d = new frappe.ui.Dialog({
        title: '⚠️ Tender Due Date Reminder',
        fields: [
            {
                fieldtype: 'HTML',
                fieldname: 'tender_table',
                options: `
                    <table border="1" cellpadding="6" 
                        style="width:100%;border-collapse:collapse;margin-bottom:15px">
                        <thead style="background:#fff3cd">
                            <tr>
                                <th>Tender ID</th>
                                <th>title</th>
                                <th>Due Date</th>
                                <th>Supplier</th>
                                <th>EMD</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <p style="color:red;font-weight:bold;font-size:14px;">
                        The due date is tomorrow! Please ensure all documents are submitted.
                    </p>
                `
            },
            {
                fieldtype: 'Datetime',
                fieldname: 'custom_remind_time',
                label: 'Custom Reminder Time',
                description: 'You will receive a reminder at this time'
            }
        ],
        primary_action_label: '🔔 Remind in 1 Hour',
        primary_action: function() {
            const oneHourLater = new Date().getTime() + (60 * 60 * 1000);
            localStorage.setItem('tender_remind_at', oneHourLater);
            localStorage.removeItem('tender_custom_remind_at');

            frappe.show_alert({
                message: 'Reminder set for 1 hour later.',
                indicator: 'green'
            });

            d.hide();
        },
        secondary_action_label: '⏰ Set Custom Time',
        secondary_action: function() {
            const customTime = d.get_value('custom_remind_time');

            if (!customTime) {
                frappe.show_alert({
                    message: 'Please select a time first.',
                    indicator: 'red'
                });
                return;
            }

            const customTimestamp = new Date(customTime).getTime();
            localStorage.setItem('tender_custom_remind_at', customTimestamp);
            localStorage.removeItem('tender_remind_at');

            frappe.show_alert({
                message: `Reminder set for: ${customTime}`,
                indicator: 'green'
            });

            d.hide();
        }
    });

    d.show();
}
 