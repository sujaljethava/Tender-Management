// frappe.after_ajax(function () {
//     frappe.call({
//         method: 'tender_management.api.get_pending_emd_tenders',
//         callback: function (r) {
//             if (r.message && r.message.length > 0) {
//                 show_global_emd_alert(r.message);
//             }
//         }
//     });
// });

// function show_global_emd_alert(tenders) {

//     let pending = tenders.filter(t => {
//         if (localStorage.getItem('emd_received_' + t.name) === 'done') return false;
//         let remind_time = localStorage.getItem('emd_remind_' + t.name);
//         if (remind_time && new Date().getTime() < parseInt(remind_time)) return false;
//         return true;
//     });

//     if (pending.length === 0) return;

//     // Row-wise HTML banavo
//     let rows = pending.map(t => `
//         <tr style="border-bottom:1px solid #e5e7eb;" id="emd-row-${t.name}">
//             <td style="padding:8px 6px; font-size:11px;">${t.name}</td>
//             <td style="padding:8px 6px; font-size:11px;">${t.title || '-'}</td>
//             <td style="padding:8px 6px; font-size:11px;">${t.district || '-'}</td>
//             <td style="padding:8px 6px; font-size:11px; font-weight:bold; color:#e02424;">
//                 ₹ ${t.emd || '0'}
//             </td>
//             <td style="padding:6px 4px; white-space:nowrap;">
//                 <select id="remind-select-${t.name}" 
//                     style="font-size:10px; padding:3px 4px; border:1px solid #d1d5db; 
//                            border-radius:4px; margin-bottom:3px; width:30%;">
//                     <option>30 Minutes</option>
//                     <option selected>1 Hour</option>
//                     <option>2 Hours</option>
//                     <option>4 Hours</option>
//                     <option>1 Day</option>
//                     <option>3 Days</option>
//                 </select>
//                 <button onclick="remind_later_single('${t.name}')"
//                     style="font-size:10px; padding:3px 6px; background:#f3f4f6; 
//                            border:1px solid #d1d5db; border-radius:4px; 
//                            cursor:pointer; width:30%; margin-bottom:2px;">
//                     ⏰ Remind Later
//                 </button>
//                 <button onclick="emd_received_single('${t.name}')"
//                     style="font-size:10px; padding:3px 6px; background:#057a55; 
//                            color:white; border:none; border-radius:4px; 
//                            cursor:pointer; width:30%;">
//                     ✅ EMD Received
//                 </button>
//             </td>
//         </tr>
//     `).join('');

//     let d = new frappe.ui.Dialog({
//         title: '⚠️ EMD Return Pending — ' + pending.length + ' Tender(s)',
//         fields: [
//             {
//                 fieldtype: 'HTML',
//                 options: `
//                 <div style="overflow-x:auto;">
//                     <p style="color:#6b7280; font-size:12px; margin-bottom:10px;">
//                         Below Disqualified Tenders have EMD Return pending. 
//                         Please collect EMD from respective parties.
//                     </p>
//                     <table style="width:100%; border-collapse:collapse; font-size:12px;">
//                         <thead>
//                             <tr style="background:#1a56db; color:white;">
//                                 <th style="padding:8px 6px; text-align:left;">Tender ID</th>
//                                 <th style="padding:8px 6px; text-align:left;">Product Name</th>
//                                 <th style="padding:8px 6px; text-align:left;">District</th>
//                                 <th style="padding:8px 6px; text-align:left;">EMD Amount</th>
//                                 <th style="padding:8px 6px; text-align:left;">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody id="emd-table-body">
//                             ${rows}
//                         </tbody>
//                     </table>
//                     <p id="emd-all-done-msg" style="display:none; text-align:center; 
//                         color:#057a55; font-weight:bold; margin-top:12px; font-size:13px;">
//                         ✅ All EMDs have been confirmed!
//                     </p>
//                 </div>
//                 `
//             }
//         ],
//         primary_action_label: '✅ Mark All EMD Received',
//         primary_action: function () {
//             pending.forEach(t => {
//                 localStorage.setItem('emd_received_' + t.name, 'done');
//             });
//             frappe.show_alert({ message: 'All EMDs confirmed!', indicator: 'green' }, 4);
//             d.hide();
//         },
//         secondary_action_label: '⏰ Remind All Later (1 Hour)',
//         secondary_action: function () {
//             let ms = 1 * 60 * 60 * 1000;
//             let remind_time = new Date().getTime() + ms;
//             pending.forEach(t => {
//                 localStorage.setItem('emd_remind_' + t.name, remind_time);
//             });
//             frappe.show_alert({ message: 'Will remind after 1 Hour!', indicator: 'blue' }, 4);
//             d.hide();
//         }
//     });

//     d.show();

//     // Row-wise Remind Later
//     window.remind_later_single = function (tender_name) {
//         let select = document.getElementById('remind-select-' + tender_name);
//         let remind = select ? select.value : '1 Hour';
//         let ms = {
//             '30 Minutes': 30 * 60 * 1000,
//             '1 Hour':      1 * 60 * 60 * 1000,
//             '2 Hours':     2 * 60 * 60 * 1000,
//             '4 Hours':     4 * 60 * 60 * 1000,
//             '1 Day':      24 * 60 * 60 * 1000,
//             '3 Days':  3 * 24 * 60 * 60 * 1000
//         }[remind] || 3600000;

//         localStorage.setItem('emd_remind_' + tender_name, new Date().getTime() + ms);

//         let row = document.getElementById('emd-row-' + tender_name);
//         if (row) {
//             row.style.opacity = '0.4';
//             row.style.background = '#f9fafb';
//         }
//         frappe.show_alert({ 
//             message: tender_name + ' — Remind after ' + remind, 
//             indicator: 'blue' 
//         }, 3);
//         check_all_done(d);
//     };

//     // Row-wise EMD Received
//     window.emd_received_single = function (tender_name) {
//         localStorage.setItem('emd_received_' + tender_name, 'done');

//         let row = document.getElementById('emd-row-' + tender_name);
//         if (row) {
//             row.style.background = '#d1fae5';
//             row.innerHTML = `
//                 <td colspan="5" style="padding:10px; text-align:center; 
//                     color:#057a55; font-weight:bold; font-size:12px;">
//                     ✅ ${tender_name} — EMD Received & Confirmed
//                 </td>
//             `;
//         }
//         frappe.show_alert({ 
//             message: tender_name + ' — EMD Confirmed!', 
//             indicator: 'green' 
//         }, 3);
//         check_all_done(d);
//     };

//     // Check if all done — dialog auto close
//     function check_all_done(dialog) {
//         let remaining = pending.filter(t => 
//             localStorage.getItem('emd_received_' + t.name) !== 'done' &&
//             !localStorage.getItem('emd_remind_' + t.name)
//         );
//         if (remaining.length === 0) {
//             let msg = document.getElementById('emd-all-done-msg');
//             if (msg) msg.style.display = 'block';
//             setTimeout(() => dialog.hide(), 1500);
//         }
//     }
// }













// frappe.after_ajax(function () {
//     frappe.call({
//         method: 'tender_management.api.get_pending_emd_tenders',
//         callback: function (r) {
//             if (r.message && r.message.length > 0) {
//                 show_global_emd_alert(r.message);
//             }
//         }
//     });
// });

// function show_global_emd_alert(tenders) {

//     let pending = tenders.filter(t => {
//         if (localStorage.getItem('emd_received_' + t.name) === 'done') return false;

//         let remind_time = localStorage.getItem('emd_remind_' + t.name);
//         if (remind_time && new Date().getTime() < parseInt(remind_time)) return false;

//         return true;
//     });

//     if (pending.length === 0) return;

//     // 🔥 Card UI Rows
//     let rows = pending.map(t => `
//         <div class="emd-card" id="emd-row-${t.name}">

//             <div class="emd-left">
//                 <div class="emd-title">${t.title || 'No Title'}</div>
//                 <div class="emd-meta">
//                     <span>#${t.name}</span> • ${t.district || '-'}
//                 </div>
//             </div>

//             <div class="emd-amount">₹ ${t.emd || 0}</div>

//             <div class="emd-actions">
//                 <select id="remind-select-${t.name}" class="emd-select">
//                     <option>30 Minutes</option>
//                     <option selected>1 Hour</option>
//                     <option>2 Hours</option>
//                     <option>4 Hours</option>
//                     <option>1 Day</option>
//                     <option>3 Days</option>
//                 </select>

//                 <button class="btn-remind" onclick="remind_later_single('${t.name}')">⏰</button>
//                 <button class="btn-success" onclick="emd_received_single('${t.name}')">✔</button>
//             </div>

//         </div>
//     `).join('');

//     let d = new frappe.ui.Dialog({
//         title: 'EMD Return Pending',
//         size: 'large',
//         fields: [
//             {
//                 fieldtype: 'HTML',
//                 options: `
// <style>

// .emd-container {
//     max-height: 400px;
//     overflow-y: auto;
// }

// .emd-card {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     background: #fff;
//     border: 1px solid #e5e7eb;
//     border-radius: 10px;
//     padding: 10px;
//     margin-bottom: 8px;
//     transition: 0.2s;
// }

// .emd-card:hover {
//     box-shadow: 0 4px 12px rgba(0,0,0,0.08);
// }

// .emd-title {
//     font-weight: 600;
//     font-size: 13px;
// }

// .emd-meta {
//     font-size: 11px;
//     color: #6b7280;
// }

// .emd-amount {
//     font-weight: bold;
//     color: #dc2626;
// }

// .emd-actions {
//     display: flex;
//     gap: 5px;
// }

// .emd-select {
//     font-size: 11px;
//     border-radius: 5px;
// }

// .btn-remind {
//     background: #f3f4f6;
//     border: none;
//     padding: 5px 7px;
//     border-radius: 6px;
//     cursor: pointer;
// }

// .btn-success {
//     background: #16a34a;
//     color: white;
//     border: none;
//     padding: 5px 7px;
//     border-radius: 6px;
//     cursor: pointer;
// }

// .btn-success:hover {
//     background: #15803d;
// }

// .header-box {
//     background: #1d4ed8;
//     color: white;
//     padding: 10px;
//     border-radius: 8px;
//     margin-bottom: 10px;
// }

// </style>

// <div class="header-box">
//     ⚠️ <b>${pending.length} EMD Pending</b>
// </div>

// <div class="emd-container">
//     ${rows}
// </div>

// <p id="emd-all-done-msg" style="display:none; text-align:center; color:green; margin-top:10px;">
//     ✅ All Done!
// </p>
//                 `
//             }
//         ],
//         primary_action_label: 'Mark All Received',
//         primary_action: function () {
//             pending.forEach(t => {
//                 localStorage.setItem('emd_received_' + t.name, 'done');
//             });
//             frappe.show_alert('All EMD Confirmed', 3);
//             d.hide();
//         }
//     });

//     d.show();

//     // 🔔 Remind Later
//     window.remind_later_single = function (name) {

//         let value = document.getElementById('remind-select-' + name).value;

//         let ms_map = {
//             '30 Minutes': 30 * 60 * 1000,
//             '1 Hour': 60 * 60 * 1000,
//             '2 Hours': 2 * 60 * 60 * 1000,
//             '4 Hours': 4 * 60 * 60 * 1000,
//             '1 Day': 24 * 60 * 60 * 1000,
//             '3 Days': 3 * 24 * 60 * 60 * 1000
//         };

//         localStorage.setItem('emd_remind_' + name, new Date().getTime() + ms_map[value]);

//         document.getElementById('emd-row-' + name).style.opacity = "0.4";

//         frappe.show_alert(name + ' remind set', 2);
//     };

//     // ✅ Received
//     window.emd_received_single = function (name) {

//         localStorage.setItem('emd_received_' + name, 'done');

//         let row = document.getElementById('emd-row-' + name);

//         row.style.background = '#dcfce7';
//         row.innerHTML = `<div style="width:100%; text-align:center; font-weight:bold;">
//             ✔ ${name} Completed
//         </div>`;

//         frappe.show_alert(name + ' done', 2);
//     };
// }









frappe.after_ajax(function () {
    frappe.call({
        method: 'tender_management.api.get_pending_emd_tenders',
        callback: function (r) {
            if (r.message && r.message.length > 0) {
                show_global_emd_alert(r.message);
            }
        }
    });
});

function show_global_emd_alert(tenders) {

    // ❌ OLD FILTER REMOVE
    // ✅ BADHA RECORD SHOW KARVA
    let pending = tenders;

    if (pending.length === 0) return;

    // 🔥 Card UI Rows
    let rows = pending.map(t => {

        let is_done = localStorage.getItem('emd_received_' + t.name) === 'done';

        return `
        <div class="emd-card" id="emd-row-${t.name}" 
            style="${is_done ? 'background:#dcfce7;' : ''}">
            
            <div class="emd-left">
                <div class="emd-title">${t.title || 'No Title'}</div>

                <div class="emd-id">🆔 ${t.tender_id || '-'}</div>
<div class="emd-meta">
    📍 ${t.district || '-'} 
    <span style="margin-left:8px; color:#9ca3af;">(Ref: ${t.name})</span>
</div>
            </div>

            <div class="emd-amount">₹ ${t.emd || 0}</div>

            <div class="emd-actions">

                ${is_done ? `
                    <span class="emd-done-badge">✅ Received</span>
                ` : `
                    <select id="remind-select-${t.name}" class="emd-select">
                        <option>30 Minutes</option>
                        <option selected>1 Hour</option>
                        <option>2 Hours</option>
                        <option>4 Hours</option>
                        <option>1 Day</option>
                        <option>3 Days</option>
                    </select>

                    <button class="btn-remind" onclick="remind_later_single('${t.name}')">⏰</button>
                    <button class="btn-success" onclick="emd_received_single('${t.name}')">✔</button>
                `}
            </div>

        </div>
        `;
    }).join('');

    let d = new frappe.ui.Dialog({
        title: 'EMD Return Status',
        size: 'large',
        fields: [
            {
                fieldtype: 'HTML',
                options: `
<style>

.emd-container {
    max-height: 400px;
    overflow-y: auto;
}

.emd-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 8px;
    transition: 0.2s;
}

.emd-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.emd-title {
    font-weight: 600;
    font-size: 13px;
}

.emd-id {
    font-size: 11px;
    font-weight: 600;
    color: #111827;
}

.emd-meta {
    font-size: 11px;
    color: #6b7280;
}

.emd-amount {
    font-weight: bold;
    color: #dc2626;
}

.emd-actions {
    display: flex;
    gap: 5px;
    align-items: center;
}

.emd-select {
    font-size: 11px;
    border-radius: 5px;
}

.btn-remind {
    background: #f3f4f6;
    border: none;
    padding: 5px 7px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-success {
    background: #16a34a;
    color: white;
    border: none;
    padding: 5px 7px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-success:hover {
    background: #15803d;
}

.emd-done-badge {
    background: #16a34a;
    color: white;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 6px;
}

.header-box {
    background: #1d4ed8;
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
}

</style>

<div class="header-box">
    📊 <b>${pending.length} Total EMD Records</b>
</div>

<div class="emd-container">
    ${rows}
</div>
                `
            }
        ],
        primary_action_label: 'Mark All Received',
        primary_action: function () {
            pending.forEach(t => {
                localStorage.setItem('emd_received_' + t.name, 'done');
            });
            frappe.show_alert('All EMD Confirmed', 3);
            d.hide();
        }
    });

    d.show();

    window.remind_later_single = function (name) {

        let value = document.getElementById('remind-select-' + name).value;

        let ms_map = {
            '30 Minutes': 30 * 60 * 1000,
            '1 Hour': 60 * 60 * 1000,
            '2 Hours': 2 * 60 * 60 * 1000,
            '4 Hours': 4 * 60 * 60 * 1000,
            '1 Day': 24 * 60 * 60 * 1000,
            '3 Days': 3 * 24 * 60 * 60 * 1000
        };

        localStorage.setItem('emd_remind_' + name, new Date().getTime() + ms_map[value]);

        document.getElementById('emd-row-' + name).style.opacity = "0.4";

        let tender = pending.find(t => t.name === name);
        let display_id = tender?.tender_id || name;

        frappe.show_alert(display_id + ' remind set', 2);
    };


    window.emd_received_single = function (name) {

        let row = document.getElementById('emd-row-' + name);

        let tender = pending.find(t => t.name === name);
        let display_id = tender?.tender_id || name;

        frappe.call({
            method: 'tender_management.api.mark_emd_received',
            args: {
                tender_name: name
            },
            callback: function () {

                row.style.background = '#dcfce7';

                row.innerHTML = `
                <div style="width:100%; text-align:center; font-weight:bold; color:#15803d;">
                    ✅ ${display_id} — EMD Received
                </div>
            `;

                frappe.show_alert(display_id + ' updated', 2);

                // 🔥 row remove (optional but best)
                setTimeout(() => {
                    row.remove();
                }, 800);
            }
        });
    };
}