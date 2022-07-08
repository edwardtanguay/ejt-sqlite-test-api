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

// http://localhost:3345/employees-by-city/London
app.get('/employees-by-city/:city', async (req, res) => {
	const city = req.params.city;
    const employees = await qsql.getRecordsWithSql(
        `SELECT EmployeeID, LastName, FirstName, BirthDate, City, Title FROM Employees WHERE City = '${city}'`
    );
    res.json(employees);
});

// http://localhost:3345/employees-by-birth-year/1952
app.get('/employees-by-birth-year/:year', async (req, res) => {
	const year = req.params.year;
	const employees = await qsql.getRecordsWithSql(
		`SELECT EmployeeID, LastName, FirstName, BirthDate, City, Title FROM Employees WHERE substr(Birthdate,1,4)  = '${year}'`
    );
    res.json(employees);
});


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
