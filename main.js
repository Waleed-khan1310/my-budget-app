// BudgetPro - Main JavaScript File
// Real-time budget management with interactive charts and animations

class BudgetManager {
    constructor() {
        this.data = {
            income: 5250,
            expenses: 3847,
            categories: {
                housing: { budget: 2000, spent: 1800, icon: '🏠', color: 'blue' },
                food: { budget: 800, spent: 642, icon: '🍕', color: 'orange' },
                transportation: { budget: 500, spent: 380, icon: '🚗', color: 'purple' },
                entertainment: { budget: 400, spent: 285, icon: '🎬', color: 'pink' },
                healthcare: { budget: 300, spent: 180, icon: '🏥', color: 'red' }
            },
            transactions: [
                { type: 'expense', category: 'food', amount: 24.50, description: 'Pizza Palace', date: new Date() },
                { type: 'expense', category: 'housing', amount: 1800, description: 'Rent Payment', date: new Date(Date.now() - 86400000) },
                { type: 'income', amount: 5250, description: 'Salary Deposit', date: new Date(Date.now() - 172800000) },
                { type: 'expense', category: 'transportation', amount: 52.30, description: 'Gas Station', date: new Date(Date.now() - 259200000) }
            ]
        };
        
        this.init();
    }

    init() {
        this.initializeCharts();
        this.setupEventListeners();
        this.animateCounters();
        this.updateDashboard();
    }

    // Initialize ECharts for data visualization
    initializeCharts() {
        const chartDom = document.getElementById('spending-chart');
        if (chartDom) {
            const myChart = echarts.init(chartDom);
            
            const option = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#2D5A3D',
                    borderWidth: 1,
                    textStyle: {
                        color: '#36454F'
                    }
                },
                legend: {
                    data: ['Budget', 'Spent'],
                    bottom: 0,
                    textStyle: {
                        color: '#36454F'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['Housing', 'Food', 'Transport', 'Entertainment', 'Healthcare'],
                    axisLine: {
                        lineStyle: {
                            color: '#E5E5E5'
                        }
                    },
                    axisLabel: {
                        color: '#36454F'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#E5E5E5'
                        }
                    },
                    axisLabel: {
                        color: '#36454F',
                        formatter: '${value}'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#F0F0F0'
                        }
                    }
                },
                series: [
                    {
                        name: 'Budget',
                        type: 'bar',
                        data: [2000, 800, 500, 400, 300],
                        itemStyle: {
                            color: 'rgba(45, 90, 61, 0.3)',
                            borderRadius: [4, 4, 0, 0]
                        }
                    },
                    {
                        name: 'Spent',
                        type: 'bar',
                        data: [1800, 642, 380, 285, 180],
                        itemStyle: {
                            color: '#2D5A3D',
                            borderRadius: [4, 4, 0, 0]
                        }
                    }
                ]
            };

            myChart.setOption(option);
            
            // Make chart responsive
            window.addEventListener('resize', () => {
                myChart.resize();
            });
        }
    }

    // Setup event listeners for interactive elements
    setupEventListeners() {
        // Expense form submission
        const expenseForm = document.getElementById('expense-form');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExpenseSubmission(e);
            });
        }

        // Income form submission
        const incomeForm = document.getElementById('income-form');
        if (incomeForm) {
            incomeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleIncomeSubmission(e);
            });
        }

        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                this.hideAllModals();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    // Animate counter numbers on page load
    animateCounters() {
        const counters = document.querySelectorAll('.animate-counter');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.textContent.replace(/[$,%]/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    if (counter.textContent.includes('$')) {
                        counter.textContent = '$' + Math.floor(current).toLocaleString();
                    } else if (counter.textContent.includes('%')) {
                        counter.textContent = Math.floor(current) + '%';
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (counter.textContent.includes('$')) {
                        counter.textContent = '$' + target.toLocaleString();
                    } else if (counter.textContent.includes('%')) {
                        counter.textContent = target + '%';
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
            };

            setTimeout(updateCounter, 500);
        });

        // Animate progress bars
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }, 800);
    }

    // Update dashboard with current data
    updateDashboard() {
        const remaining = this.data.income - this.data.expenses;
        const savingsRate = Math.round((remaining / this.data.income) * 100);

        // Update summary cards
        document.getElementById('total-income').textContent = '$' + this.data.income.toLocaleString();
        document.getElementById('total-expenses').textContent = '$' + this.data.expenses.toLocaleString();
        document.getElementById('remaining-budget').textContent = '$' + remaining.toLocaleString();

        // Update budget category cards
        this.updateCategoryCards();
        
        // Update recent transactions
        this.updateRecentTransactions();
    }

    // Update category progress cards
    updateCategoryCards() {
        const categoriesContainer = document.getElementById('budget-categories');
        if (!categoriesContainer) return;

        categoriesContainer.innerHTML = '';

        Object.entries(this.data.categories).forEach(([key, category]) => {
            const percentage = Math.round((category.spent / category.budget) * 100);
            const remaining = category.budget - category.spent;
            
            const categoryCard = document.createElement('div');
            categoryCard.className = 'expense-item p-4 rounded-lg border border-gray-100';
            categoryCard.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3">
                        <div class="category-icon bg-${category.color}-100 text-${category.color}-600">${category.icon}</div>
                        <span class="font-medium text-gray-900">${this.formatCategoryName(key)}</span>
                    </div>
                    <span class="text-sm text-gray-500">$${category.spent.toLocaleString()} / $${category.budget.toLocaleString()}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div class="progress-bar h-2 rounded-full" style="width: ${percentage}%"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                    <span>$${remaining.toLocaleString()} remaining</span>
                    <span>${percentage}% used</span>
                </div>
            `;
            
            categoriesContainer.appendChild(categoryCard);
        });
    }

    // Update recent transactions list
    updateRecentTransactions() {
        const transactionsContainer = document.getElementById('recent-transactions');
        if (!transactionsContainer) return;

        const recentTransactions = this.data.transactions.slice(0, 4);
        
        transactionsContainer.innerHTML = '';

        recentTransactions.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'flex items-center justify-between py-2';
            
            if (transaction.type === 'expense') {
                const category = this.data.categories[transaction.category];
                transactionElement.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="category-icon bg-${category.color}-100 text-${category.color}-600">${category.icon}</div>
                        <div>
                            <p class="font-medium text-gray-900 text-sm">${transaction.description}</p>
                            <p class="text-xs text-gray-500">${this.formatDate(transaction.date)}</p>
                        </div>
                    </div>
                    <span class="text-sm font-medium text-red-600">-$${transaction.amount.toFixed(2)}</span>
                `;
            } else {
                transactionElement.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="category-icon bg-green-100 text-green-600">💰</div>
                        <div>
                            <p class="font-medium text-gray-900 text-sm">${transaction.description}</p>
                            <p class="text-xs text-gray-500">${this.formatDate(transaction.date)}</p>
                        </div>
                    </div>
                    <span class="text-sm font-medium text-green-600">+$${transaction.amount.toFixed(2)}</span>
                `;
            }
            
            transactionsContainer.appendChild(transactionElement);
        });
    }

    // Handle expense form submission
    handleExpenseSubmission(e) {
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount') || e.target.querySelector('input[type="number"]').value);
        const category = formData.get('category') || e.target.querySelector('select').value;
        const description = formData.get('description') || e.target.querySelector('input[type="text"]').value;

        if (amount && category && description) {
            // Add to transactions
            this.data.transactions.unshift({
                type: 'expense',
                category: category,
                amount: amount,
                description: description,
                date: new Date()
            });

            // Update category spending
            this.data.categories[category].spent += amount;
            this.data.expenses += amount;

            // Update dashboard
            this.updateDashboard();
            this.animateCounters();
            
            // Show success message
            this.showNotification('Expense added successfully!', 'success');
            
            // Reset form and close modal
            e.target.reset();
            this.hideAddExpenseModal();
        }
    }

    // Handle income form submission
    handleIncomeSubmission(e) {
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount') || e.target.querySelector('input[type="number"]').value);
        const source = formData.get('source') || e.target.querySelector('input[type="text"]').value;
        const type = formData.get('type') || e.target.querySelector('select').value;

        if (amount && source && type) {
            // Add to transactions
            this.data.transactions.unshift({
                type: 'income',
                amount: amount,
                description: source,
                date: new Date()
            });

            // Update total income
            this.data.income += amount;

            // Update dashboard
            this.updateDashboard();
            this.animateCounters();
            
            // Show success message
            this.showNotification('Income added successfully!', 'success');
            
            // Reset form and close modal
            e.target.reset();
            this.hideAddIncomeModal();
        }
    }

    // Utility functions
    formatCategoryName(key) {
        return key.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInCubic',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }

    // Modal management functions
    hideAllModals() {
        this.hideAddExpenseModal();
        this.hideAddIncomeModal();
    }

    hideAddExpenseModal() {
        const modal = document.getElementById('add-expense-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    hideAddIncomeModal() {
        const modal = document.getElementById('add-income-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Global functions for modal management
function showAddExpenseModal() {
    const modal = document.getElementById('add-expense-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="number"]');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function showAddIncomeModal() {
    const modal = document.getElementById('add-income-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="number"]');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function showAddCategoryModal() {
    alert('Category management coming soon! For now, use the existing categories.');
}

function hideAddExpenseModal() {
    const modal = document.getElementById('add-expense-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function hideAddIncomeModal() {
    const modal = document.getElementById('add-income-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetManager = new BudgetManager();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover animations for cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.02,
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
    });

    // Add click animation for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);