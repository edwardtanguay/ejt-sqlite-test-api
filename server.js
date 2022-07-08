import express from 'express';
import * as qsql from './qtools/qsql.js';

const app = express();
const port = 3345;

app.use(express.json());

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

// http://localhost:3345/employees-search
app.get('/employees-search', async (req, res) => {
    const searchText = req.body.searchText;
    const employees = await qsql.getRecordsWithSql(
        `SELECT FirstName, LastName, Title, Notes FROM Employees WHERE Notes LIKE '%${searchText}%' OR Title LIKE '%${searchText}%'`
    );
    res.json(employees);
});

// http://localhost:3345/employee-territories/2
// {
//    "employee": "James Baldwin",
//	  "territories": ['Westboro', '...', '...']
// }
app.get('/employee-territories/:employeeId', async (req, res) => {
    const employeeId = req.params.employeeId;
    const records = await qsql.getRecordsWithSql(
        `SELECT FirstName, LastName, TRIM(t.TerritoryDescription) AS territory FROM Employees AS e 
JOIN EmployeeTerritories AS et ON e.EmployeeID = et.EmployeeID
JOIN Territories AS t ON et.TerritoryID = t.TerritoryID
WHERE e.EmployeeID = ${employeeId}`
    );
    const data = {
		employee: `${records[0].FirstName} ${records[0].LastName}`,
		territories: records.map(m => m.territory)
    };
    res.json(data);
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
