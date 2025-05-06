const EmployeeModel = require('../models/employee');
const EducationModel = require('../models/education');
const FamilyModel = require('../models/employee_family');
const EmployeeProfileModel = require('../models/employee_profile');
const { sequelize } = require('../config/database');

// Controller function to handle inserting a new employee
async function createEmployee(req, res) {
    const {
        nik, name, is_active, start_date, end_date,
        profile, education = [], family = []
    } = req.body;

    // Basic validation
    if (!nik || !name || !start_date || !end_date || !profile) {
        return res.status(400).json({ error: 'NIK, name, start_date, end_date, and profile are required' });
    }

    const employee = {
        nik,
        name,
        is_active: typeof is_active === 'boolean' ? is_active : true,
        start_date,
        end_date,
    };

    const t = await sequelize.transaction(); // Begin transaction

    try {
        // Insert employee
        const result = await EmployeeModel.insertEmployee(employee, t);
        const employeeId = result[0].id;

        // Insert profile
        const profileData = {
            employee_id: employeeId,
            place_of_birth: profile.place_of_birth,
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            is_married: profile.is_married,
            prof_pict: profile.prof_pict,
        };
        await EmployeeProfileModel.insertEmployeeProfile(profileData, t);

        // Insert education list
        for (const edu of education) {
            const eduData = {
                employee_id: employeeId,
                name: edu.name,
                level: edu.level,
                description: edu.description
            };
            await EducationModel.insertEducation(eduData, t);
        }

        // Insert family list
        for (const fam of family) {
            const famData = {
                employee_id: employeeId,
                name: fam.name,
                identifier: fam.identifier,
                job: fam.job,
                place_of_birth: fam.place_of_birth,
                date_of_birth: fam.date_of_birth,
                religion: fam.religion,
                is_life: fam.is_life,
                is_divorced: fam.is_divorced,
                relation_status: fam.relation_status
            };
            await FamilyModel.insertEmployeeFamily(famData, t);
        }

        await t.commit(); // Commit transaction

        return res.status(201).json({
            message: 'Employee created successfully',
            employeeId
        });

    } catch (error) {
        await t.rollback(); // Rollback on error
        console.error('Error creating employee:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateDataEmployee(req, res) {
    const { id } = req.params;
    const {
        nik, name, is_active, start_date, end_date,
        profile, education = [], family = []
    } = req.body;

    if (!id || !nik || !name || !start_date || !end_date) {
        return res.status(400).json({ error: 'id, NIK, name, start_date, and end_date are required' });
    }

    const employee = {
        id,
        nik,
        name,
        is_active: is_active ?? true,
        start_date,
        end_date,
    };

    const t = await sequelize.transaction();

    try {
        // Update main employee
        await EmployeeModel.updateEmployee(employee, t);

        // Update profile
        if (profile) {
            await EmployeeProfileModel.updateEmployeeProfile({
                ...profile,
                employee_id: id
            }, t);
        }

        // Update education - delete then re-insert (simplest approach)
        await EducationModel.deleteByEmployeeId(id, t);
        for (const edu of education) {
            await EducationModel.insertEmployeeEducation({ ...edu, employee_id: id }, t);
        }

        // Update family - delete then re-insert (simplest approach)
        await FamilyModel.deleteByEmployeeId(id, t);
        for (const fam of family) {
            await FamilyModel.insertEmployeeFamily({ ...fam, employee_id: id }, t);
        }

        await t.commit();
        return res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        await t.rollback();
        console.error('Error updating employee:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function listEmployee(req, res) {
    try {
        // Get query parameters with default values
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Simple validation
        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ error: 'Invalid pagination parameters' });
        }

        const employees = await EmployeeModel.getListEmployee(page, pageSize);

        res.status(200).json({
            data: employees,
            pagination: {
                page,
                pageSize
            }
        });
    } catch (error) {
        console.error('Error in listEmployees controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getEmployee(req, res) {
    const id = parseInt(req.params.id);

    // Validate ID
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    try {
        const employee = await EmployeeModel.getEmployeeById(id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ data: employee });
    } catch (error) {
        console.error('Error in getEmployee controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteEmployee(req, res) {
    const { id } = req.params;

    // Validate ID
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const t = await sequelize.transaction(); // Begin transaction

    try {
        // Delete associated employee profile
        await EmployeeProfileModel.deleteByEmployeeId(id, t);

        // Delete associated education records
        await EducationModel.deleteByEmployeeId(id, t);

        // Delete associated family records
        await FamilyModel.deleteByEmployeeId(id, t);

        // Delete employee record
        await EmployeeModel.deleteEmployee(id, t);

        await t.commit(); // Commit transaction

        return res.status(200).json({ message: 'Employee and associated data deleted successfully' });

    } catch (error) {
        await t.rollback(); // Rollback on error
        console.error('Error deleting employee:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function reportEmployee(req, res) {
    try {
        // Ambil data karyawan menggunakan model
        const employees = await EmployeeModel.getReportEmployee();

        res.status(200).json({
            data: employees
        });
    } catch (error) {
        console.error('Error in listEmployees controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createEmployee, updateDataEmployee, listEmployee, getEmployee, deleteEmployee, reportEmployee
};
