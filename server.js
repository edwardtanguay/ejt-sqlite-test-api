import express from 'express';
import * as qsql from './qtools/qsql.js';
import * as qfil from './qtools/qfil.js';

const app = express();
const port = 3345;

app.get('/', (req, res) => {
    const indexContent = qfil.getFileAsStringBlock('views/index.html');
    res.send(indexContent);
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

// http://localhost:3345/employees-search/french
app.get('/employees-search/:searchText', async (req, res) => {
    const searchText = req.params.searchText;
    const employees = await qsql.getRecordsWithSql(
        `SELECT FirstName, LastName, Title, Notes FROM Employees WHERE Notes LIKE '%${searchText}%' OR Title LIKE '%${searchText}%'`
    );
    res.json(employees);
});

// http://localhost:3345/employee-territories-by-employee/2
app.get('/employee-territories-by-employee/:employeeId', async (req, res) => {
    const employeeId = req.params.employeeId;
    const records = await qsql.getRecordsWithSql(
        `SELECT FirstName, LastName, TRIM(t.TerritoryDescription) AS territory FROM Employees AS e 
JOIN EmployeeTerritories AS et ON e.EmployeeID = et.EmployeeID
JOIN Territories AS t ON et.TerritoryID = t.TerritoryID
WHERE e.EmployeeID = ${employeeId}`
    );
    const data = {
        employee: `${records[0].FirstName} ${records[0].LastName}`,
        territories: records.map((m) => m.territory)
    };
    res.json(data);
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
