#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { format, parseISO } from 'date-fns';
import fs from 'fs';

const program = new Command();
const FILE = 'expenses.json';

// Load or create data
let expenses = [];
if (fs.existsSync(FILE)) {
  expenses = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

// Save data
const saveData = () => {
  fs.writeFileSync(FILE, JSON.stringify(expenses, null, 2));
};

// Add Expense
program
  .command('add')
  .description('Add a new expense')
  .requiredOption('--description <desc>', 'Expense description')
  .requiredOption('--amount <amount>', 'Expense amount', parseFloat)
  .option('--category <cat>', 'Category (Food, Transport, Shopping, etc)', 'Other')
  .action((options) => {
    const expense = {
      id: Date.now(),
      date: new Date().toISOString(),
      description: options.description,
      amount: options.amount,
      category: options.category
    };

    expenses.push(expense);
    saveData();

    console.log(chalk.green(`✓ Expense added successfully! ID: ${expense.id}`));
  });

// List Expenses
program
  .command('list')
  .description('List all expenses')
  .action(() => {
    if (expenses.length === 0) {
      console.log(chalk.yellow('No expenses found.'));
      return;
    }

    console.log(chalk.cyan('\nID\tDate\t\tDescription\t\tAmount\t\tCategory'));
    console.log('─'.repeat(80));

    expenses.forEach(exp => {
      const date = format(parseISO(exp.date), 'yyyy-MM-dd');
      console.log(`${exp.id}\t${date}\t${exp.description.padEnd(20)}\t$${exp.amount}\t\t${exp.category}`);
    });
  });

// Delete Expense
program
  .command('delete')
  .description('Delete an expense')
  .requiredOption('--id <id>', 'Expense ID', parseInt)
  .action((options) => {
    const initialLength = expenses.length;
    expenses = expenses.filter(exp => exp.id !== options.id);

    if (expenses.length < initialLength) {
      saveData();
      console.log(chalk.green(`✓ Expense with ID ${options.id} deleted successfully.`));
    } else {
      console.log(chalk.red(`✗ No expense found with ID ${options.id}`));
    }
  });

// Update Expense
program
  .command('update')
  .description('Update an expense')
  .requiredOption('--id <id>', 'Expense ID', parseInt)
  .option('--description <desc>')
  .option('--amount <amount>', 'New amount', parseFloat)
  .option('--category <cat>')
  .action((options) => {
    const expense = expenses.find(exp => exp.id === options.id);
    if (!expense) {
      console.log(chalk.red(`✗ Expense with ID ${options.id} not found.`));
      return;
    }

    if (options.description) expense.description = options.description;
    if (options.amount) expense.amount = options.amount;
    if (options.category) expense.category = options.category;

    saveData();
    console.log(chalk.green(`✓ Expense ID ${options.id} updated successfully.`));
  });

// Summary
program
  .command('summary')
  .description('Show expense summary')
  .option('--month <month>', 'Month number (1-12)')
  .action((options) => {
    let filtered = expenses;

    if (options.month) {
      filtered = expenses.filter(exp => {
        const month = parseISO(exp.date).getMonth() + 1;
        return month === parseInt(options.month);
      });
    }

    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);

    if (options.month) {
      console.log(chalk.cyan(`\nTotal expenses for month ${options.month}: $${total.toFixed(2)}`));
    } else {
      console.log(chalk.cyan(`\nTotal expenses: $${total.toFixed(2)}`));
    }
  });

// Add Budget (Bonus)
program
  .command('budget')
  .description('Set monthly budget')
  .requiredOption('--month <month>', 'Month number', parseInt)
  .requiredOption('--amount <amount>', 'Budget amount', parseFloat)
  .action((options) => {
    console.log(chalk.green(`✓ Budget for month ${options.month} set to $${options.amount}`));
    // In future you can store budget in another file
  });

program.parse();