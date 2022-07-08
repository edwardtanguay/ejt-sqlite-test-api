import express from 'express';
import * as qsql from './qtools/qsql.js';

const app = express();
const port = 3345;

app.get('/', (req, res) => {
    res.send(`<h1>SQLite API</h1>`);
});

// http://localhost:3345/employees
app.get('/employees', async (req, res) => {
    const employees = await qsql.getRecordsWithSql(
        'SELECT EmployeeID, LastName, FirstName, BirthDate, City, Title FROM Employees'
    );
    res.json(employees);
});

// http://localhost:3345/employees/5
app.get('/employees/:id', async (req, res) => {
	const id = req.params.id;
    const employees = await qsql.getRecordsWithSql(
        `SELECT EmployeeID, LastName, FirstName, BirthDate, City, Title FROM Employees WHERE EmployeeID = ${id}`
    );
    res.json(employees);
});


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
