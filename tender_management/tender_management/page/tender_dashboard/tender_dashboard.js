frappe.pages['tender-dashboard'].on_page_load = function(wrapper) {

    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Tender Dashboard',
        single_column: true
    });

    $(page.body).html(`
        <div style="padding:20px;">

            <!-- Number Cards -->
            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px;">
                <div style="flex:1; min-width:140px; background:#e3f2fd; border-radius:10px; padding:16px;">
                    <div style="font-size:12px; color:#666;">Total Tender</div>
                    <div id="val-total" style="font-size:30px; font-weight:700; color:#1565C0;">-</div>
                </div>
                <div style="flex:1; min-width:140px; background:#e8f5e9; border-radius:10px; padding:16px;">
                    <div style="font-size:12px; color:#666;">Qualified</div>
                    <div id="val-qualified" style="font-size:30px; font-weight:700; color:#2E7D32;">-</div>
                </div>
                <div style="flex:1; min-width:140px; background:#fff3e0; border-radius:10px; padding:16px;">
                    <div style="font-size:12px; color:#666;">Draft</div>
                    <div id="val-draft" style="font-size:30px; font-weight:700; color:#E65100;">-</div>
                </div>
                <div style="flex:1; min-width:140px; background:#fce4ec; border-radius:10px; padding:16px;">
                    <div style="font-size:12px; color:#666;">Disqualified</div>
                    <div id="val-disqualified" style="font-size:30px; font-weight:700; color:#B71C1C;">-</div>
                </div>
                <div style="flex:1; min-width:140px; background:#f3e5f5; border-radius:10px; padding:16px;">
                    <div style="font-size:12px; color:#666;">Submitted</div>
                    <div id="val-submitted" style="font-size:30px; font-weight:700; color:#6A1B9A;">-</div>
                </div>
                <div style="flex:1; min-width:140px; background:#e0f7fa; border-radius:10px; padding:16px;">
                    <div style="font-size:12px; color:#666;">InProgress</div>
                    <div id="val-inprogress" style="font-size:30px; font-weight:700; color:#00695C;">-</div>
                </div>
            </div>

            <!-- Charts Row 1 -->
            <div style="display:flex; gap:20px; margin-bottom:20px; flex-wrap:wrap;">
                <div style="flex:2; min-width:300px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:10px; padding:20px;">
                    <h6 style="margin-bottom:12px;">Supplier Wise Tender</h6>
                    <div id="supplier-chart"></div>
                </div>
                <div style="flex:1; min-width:250px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:10px; padding:20px;">
                    <h6 style="margin-bottom:12px;">Status Distribution</h6>
                    <div id="status-chart"></div>
                </div>
            </div>

            <!-- Monthly Trend -->
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:10px; padding:20px;">
                <h6 style="margin-bottom:12px;">Monthly Tender Count</h6>
                <div id="monthly-chart"></div>
            </div>

        </div>
    `);

    // Data Load
    frappe.call({
        method: 'tender_management.tender_management.page.tender_dashboard.tender_dashboard.get_dashboard_data',
        callback: function(r) {
            if (!r.message) return;
            let d = r.message;

            // Cards
            $('#val-total').text(d.cards.total);
            $('#val-qualified').text(d.cards.qualified);
            $('#val-draft').text(d.cards.draft);
            $('#val-disqualified').text(d.cards.disqualified);
            $('#val-submitted').text(d.cards.submitted);
            $('#val-inprogress').text(d.cards.inprogress);

            // Supplier Bar Chart
            new frappe.Chart('#supplier-chart', {
                type: 'bar',
                height: 220,
                data: {
                    labels: d.supplier_chart.labels,
                    datasets: [{ name: 'Tenders', values: d.supplier_chart.values }]
                },
                colors: ['#5e64ff']
            });

            // Status Pie Chart
            new frappe.Chart('#status-chart', {
                type: 'pie',
                height: 220,
                data: {
                    labels: d.status_chart.labels,
                    datasets: [{ values: d.status_chart.values }]
                },
                colors: ['#5e64ff','#28a745','#ffc107','#dc3545','#6f42c1','#17a2b8']
            });

            // Monthly Line Chart
            new frappe.Chart('#monthly-chart', {
                type: 'line',
                height: 200,
                data: {
                    labels: d.monthly_chart.labels,
                    datasets: [{ name: 'Count', values: d.monthly_chart.values }]
                },
                colors: ['#f39c12']
            });
        }
    });
};