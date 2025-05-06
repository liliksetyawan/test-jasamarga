const { sequelize } = require('../config/database');

const EmployeeModel = {

    async insertEmployee(employee, tx) {
        const query = `
        INSERT INTO employee 
            (
                nik, name, is_active, start_date, end_date,
                created_at, created_by, updated_at, updated_by
            )
        VALUES 
            (
                $1, $2, $3, $4, $5, 
                NOW(), 'admin',  NOW(), 'admin'
            )
        RETURNING id;
    `;

        try {
            const [result] = await sequelize.query(query, {
                bind: [
                    employee.nik, employee.name, employee.is_active, employee.start_date, employee.end_date,
                ],
                type: sequelize.QueryTypes.INSERT,
                transaction: tx
            });
            return result;
        } catch (error) {
            console.error('Error inserting employee:', error);
            throw error;
        }
    },

    async updateEmployee(employee, tx) {
        const query = `
            UPDATE employee SET
                nik = $1, name = $2, is_active = $3,
                start_date = $4, end_date = $5, updated_at = NOW()
            WHERE id = $6
        `;

        try {
            const [result] = await sequelize.query(query, {
                bind: [
                    employee.nik, employee.name, employee.is_active,
                    employee.start_date, employee.end_date, employee.id,
                ],
                type: sequelize.QueryTypes.UPDATE,
                transaction: tx, // <-- tambahkan transaksi di sini
            });
            return result;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    },

    async deleteEmployee(employeeId, tx) {
        const query = `
        DELETE FROM employee
        WHERE id = $1
    `;

        try {
            const [result] = await sequelize.query(query, {
                bind: [employeeId],
                type: sequelize.QueryTypes.DELETE,
                transaction: tx, // optional: jika ingin bagian dari transaksi
            });
            return result;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    },

    async getListEmployee(page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;
        const query = `
        SELECT 
            id, nik, name, is_active, start_date, end_date, created_at, updated_at
        FROM 
            employee
        ORDER BY 
            id DESC
        LIMIT :pageSize OFFSET :offset
    `;

        try {
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    pageSize,
                    offset
                }
            });
            return results;
        } catch (error) {
            console.error('Error fetching employee list:', error);
            throw error;
        }
    },

    async getEmployeeById(id) {
        const query = `
        SELECT 
            id, nik, name, is_active, start_date, end_date, created_at, updated_at
        FROM 
            employee
        WHERE 
            id = $1
    `;

        try {
            const [result] = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                bind: [id] // Using `bind` to pass the parameters as an array (like $1)
            });

            if (!result) {
                throw new Error(`Employee with id ${id} not found`);
            }

            return result;
        } catch (error) {
            console.error('Error fetching employee by ID:', error);
            throw error;
        }
    },

    async getReportEmployee() {
        const query = `
            SELECT 
                e.id as employee_id, e.nik, e.name, e.is_active,  
                ep.gender, EXTRACT(YEAR FROM AGE(ep.date_of_birth)) || ' Years Old' AS age, 
                ed.name as education_name, ed.level as education_level,
                CASE 
                    WHEN COUNT(f.id) = 0 THEN '-'
                    ELSE 
                        COUNT(CASE WHEN f.relation_status = 'Istri' THEN 1 END) || ' Istri & ' ||
                        COUNT(CASE WHEN f.relation_status = 'Anak' THEN 1 END) || ' Anak'
                END AS family_data
            FROM employee AS e
            LEFT JOIN employee_profile AS ep ON ep.employee_id = e.id
            LEFT JOIN education AS ed ON ed.employee_id = e.id
            LEFT JOIN employee_family AS f ON f.employee_id = e.id
            GROUP BY
                e.id, e.nik, e.name, e.is_active, ep.gender, ep.date_of_birth, ed.name, ed.level`;

        try {
            const employees = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT
            });

            return employees;
        } catch (error) {
            console.error('Error fetching employee list:', error);
            throw error;
        }
    },


};

module.exports = EmployeeModel;