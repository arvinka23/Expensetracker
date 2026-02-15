const balanceElement = document.getElementById('balance');
const incomeAmountElement = document.getElementById('income-amount');
const expenseAmountElement = document.getElementById('expense-amount');
const transactionListElement = document.getElementById('transaction-list');
const formElement = document.getElementById('transaction-form');
const descriptionInputElement = document.getElementById('description');
const amountInputElement = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

formElement.addEventListener('submit', addTransaction);

// Handles form submission, validates input, saves the new transaction to localStorage and updates the UI
function addTransaction(event) {
  event.preventDefault();

  const description = descriptionInputElement.value.trim();
  const amount = parseFloat(amountInputElement.value);

  if (!description || isNaN(amount)) {
    alert('Please enter a valid description and amount.');
    return;
  }

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });

  localStorage.setItem('transactions', JSON.stringify(transactions));

  updateTransactionList();
  updateBalance();
  updateIncomeAmount();
  updateExpenseAmount();

  formElement.reset();
}

// Clears the transaction list and re-renders all transactions sorted by newest first
function updateTransactionList() {
  transactionListElement.innerHTML = '';
  const sortedTransactions = [...transactions].sort((a, b) => b.id - a.id);
  sortedTransactions.forEach(transaction => {
    const li = document.createElement('li');

    if (transaction.amount < 0) {
      li.classList.add('expense-item');
    }

    const sign = transaction.amount < 0 ? '-' : '+';
    const displayAmount = Math.abs(transaction.amount).toFixed(2);
    li.innerHTML = `
      <span>${transaction.description}</span>
      <span>${sign}$${displayAmount}</span>
    `;

    transactionListElement.appendChild(li);
  });
}

// Calculates the total balance from all transactions and displays it
function updateBalance() {
  const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  balanceElement.textContent = `$${totalBalance.toFixed(2)}`;
}

// Filters only positive transactions (income) and displays the total income
function updateIncomeAmount() {
  const incomeAmount = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  incomeAmountElement.textContent = `$${incomeAmount.toFixed(2)}`;
}

// Filters only negative transactions (expenses) and displays the total expense as a positive value
function updateExpenseAmount() {
  const expenseAmount = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  expenseAmountElement.textContent = `$${Math.abs(expenseAmount).toFixed(2)}`;
}

// Initializes the app by rendering all stored transactions and updating balance, income and expense
function init() {
  updateTransactionList();
  updateBalance();
  updateIncomeAmount();
  updateExpenseAmount();
}

init();
