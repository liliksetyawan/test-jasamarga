const express = require('express');
const router = express.Router();
const { createEmployee, listEmployee , getEmployee, updateDataEmployee, deleteEmployee, reportEmployee} = require('../controllers/employee');

router.post('/employee', createEmployee);
router.get('/employee', listEmployee);
router.get('/employee/report', reportEmployee);
router.get('/employee/:id', getEmployee);
router.put('/employee/:id', updateDataEmployee);
router.delete('/employee/:id', deleteEmployee);


module.exports = router;
