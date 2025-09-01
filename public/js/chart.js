let expenseChartInstance = null;

function renderExpenseChart(expenses) {
  if (Array.isArray(expenses) && expenses.length > 0) {
    const categoryTotals = {};
    expenses.forEach(e => {
      const category = e.category || 'Other';
      const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (expenseChartInstance) {
      expenseChartInstance.destroy();
    }

    if (labels.length === 0) {
      document.getElementById('expenseChart').style.display = 'none';
    } else {
      document.getElementById('expenseChart').style.display = 'block';
      const ctx = document.getElementById('expenseChart').getContext('2d');
      expenseChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total by Category',
            data: data,
            backgroundColor: [
              '#26a69a', '#80cbc4', '#004d40', '#b2dfdb', '#ffab91', '#ff7043', '#d32f2f'
            ],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#004d40', font: { size: 14 } }
            },
            x: {
              ticks: { color: '#004d40', font: { size: 14 } }
            }
          }
        }
      });
    }

    let totalsHtml = '';
    labels.forEach((cat, idx) => {
      totalsHtml += `<div style="margin:10px 0; font-size:1.1rem;"><strong>${cat}:</strong> ₹${data[idx].toFixed(2)}</div>`;
    });
    document.getElementById('categoryTotals').innerHTML = totalsHtml;

    const total = expenses.reduce((sum, e) =>
      sum + (typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount), 0
    );
    document.getElementById('totalExpense').innerText = `₹${total.toFixed(2)}`;
  } else {
    if (expenseChartInstance) {
      expenseChartInstance.destroy();
      expenseChartInstance = null;
    }
    document.getElementById('expenseChart').style.display = 'none';
    document.getElementById('categoryTotals').innerHTML = '<div>No expenses found.</div>';
    document.getElementById('totalExpense').innerText = '₹0';
  }
}
