const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('form');
const add_transaction_name = document.getElementById('add_transaction_name');
const add_transaction_amount = document.getElementById('add_transaction_amount');

const apiUrl = 'http://localhost:3000/api/transactions'; // Replace with your server URL

function init() {
  list.innerHTML = '';
  getTransactions();
  calculate_money();
}

async function getTransactions() {
  try {
    const response = await fetch(apiUrl);
    const transactions = await response.json();
    list.innerHTML = ''; // Clear existing list
    transactions.forEach((transaction) => {
      console.log(transaction)
      add_data_to_list(transaction);
    });
    calculate_money();
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
  }
}

function add_data_to_list(transaction) {
  const symbol = transaction.amount < 0 ? '-' : '+';
  const status = transaction.amount < 0 ? 'minus' : 'plus';
  const item = document.createElement('li');
  const result = formatNumber(Math.abs(transaction.amount));
  item.classList.add(status);
  item.innerHTML = `${transaction.text}<span>${symbol}${result}</span><button class="delete-btn" onclick="remove_data('${transaction._id}')">x</button>`;
  list.appendChild(item);
}

async function remove_data(id) {
  console.log(id);
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    getTransactions(); // Refresh the list after deletion
  } catch (err) {
    console.error('Error deleting transaction:', err);
  }
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// function formatNumber(num) {
//   // Use Intl.NumberFormat to format numbers with commas
//   return new Intl.NumberFormat('en-US').format(num);
// }

function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// function calculate_money() {
//   const total_income = document.getElementById('money_plus');
//   const total_expense = document.getElementById('money_minus');
//   const amounts = Array.from(list.children).map((item) => {
//     const amount = parseFloat(item.querySelector('span').textContent.replace(',', ''));
//     return amount;
//   });
//   const total = amounts.reduce((result, item) => (result += item), 0).toFixed(2);
//   const income = amounts.filter((item) => item > 0).reduce((result, item) => (result += item), 0).toFixed(2);
//   const expense = (amounts.filter((item) => item < 0).reduce((result, item) => (result += item), 0) * -1).toFixed(2);
//   console.log(total)
//   balance.innerText = `฿` + formatNumber(total);
//   total_income.innerText = `฿` + formatNumber(income);
//   total_expense.innerText = `฿` + formatNumber(expense);
// }

function calculate_money() {
  const total_income = document.getElementById('money_plus');
  const total_expense = document.getElementById('money_minus');
  const amounts = Array.from(list.children).map((item) => {
    const amount = parseFloat(item.querySelector('span').textContent.replace(/,/g, '')); // Remove commas
    return amount;
  });
  const total = amounts.reduce((result, item) => (result += item), 0).toFixed(2);
  const income = amounts.filter((item) => item > 0).reduce((result, item) => (result += item), 0).toFixed(2);
  const expense = (amounts.filter((item) => item < 0).reduce((result, item) => (result += item), 0) * -1).toFixed(2);

  balance.innerText = `฿` + formatNumber(total);
  total_income.innerText = `฿` + formatNumber(income);
  total_expense.innerText = `฿` + formatNumber(expense);
}


async function addTransaction(e) {
  e.preventDefault();
  const name = document.getElementById('add_transaction_name');
  const amount = document.getElementById('add_transaction_amount');
  if (name.value.trim() === '' || amount.value.trim() === '') {
    alert('กรุณาป้อนข้อมูลให้ครบ');
  } else {
    const new_transaction = {
      text: name.value,
      amount: parseFloat(amount.value)
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_transaction)
      });
      console.log("--------------------------")
      console.log(await response.json())
      console.log("--------------------------")
      if (response.status === 201) {
        getTransactions(); // Refresh the list after adding a transaction
        add_transaction_name.value = '';
        add_transaction_amount.value = '';
      } else {
        alert('เกิดข้อผิดพลาดในการเพิ่มธุรกรรม');
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  }
}
async function addT(e) {
  e.preventDefault();

  const name = document.getElementById('add_transaction_name');
  const amount = document.getElementById('add_transaction_amount');
  const new_transaction = {
      text: name.value,
      amount: parseFloat(amount.value)
  };
  console.log(new_transaction)
  const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_transaction)
  });

  console.log(await response.json())
}
form.addEventListener('submit', addTransaction);

init();
calculate_money();
