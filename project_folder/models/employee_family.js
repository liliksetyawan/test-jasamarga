const { sequelize } = require('../config/database');

const EmployeeFamilyModel = {
    async insertEmployeeFamily(family, tx) {
        const query = `
            INSERT INTO employee_family
                (
                    employee_id, name, identifier, job, place_of_birth, date_of_birth,
                    religion, is_life, is_divorced, relation_status,
                    created_at, created_by, updated_at, updated_by
                )
            VALUES
                (
                    $1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10,
                    NOW(), 'admin', NOW(), 'admin'
                )
            RETURNING id;
        `;

        try {
            const [result] = await sequelize.query(query, {
                bind: [
                    family.employee_id,
                    family.name,
                    family.identifier,
                    family.job,
                    family.place_of_birth,
                    family.date_of_birth,
                    family.religion,
                    family.is_life,
                    family.is_divorced,
                    family.relation_status
                ],
                type: sequelize.QueryTypes.INSERT,
                transaction: tx
            });

            return result;
        } catch (error) {
            console.error('Error inserting employee family:', error);
            throw error;
        }
    },

    async deleteByEmployeeId(employee_id, tx) {
        try {
            await sequelize.query('DELETE FROM employee_family WHERE employee_id = $1', {
                bind: [employee_id],
                type: sequelize.QueryTypes.DELETE,
                transaction: tx
            });
        } catch (error) {
            console.error('Error deleting employee family:', error);
            throw error;
        }
    },

    async insertEmployeeFamily(family, tx) {
        const query = `
        INSERT INTO employee_family
            (
                employee_id, name, identifier, job, place_of_birth, date_of_birth,
                religion, is_life, is_divorced, relation_status,
                created_at, created_by, updated_at, updated_by
            )
        VALUES
            (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10,
                NOW(), 'admin', NOW(), 'admin'
            )
    `;

        try {
            await sequelize.query(query, {
                bind: [
                    family.employee_id,
                    family.name,
                    family.identifier,
                    family.job,
                    family.place_of_birth,
                    family.date_of_birth,
                    family.religion,
                    family.is_life,
                    family.is_divorced,
                    family.relation_status
                ],
                type: sequelize.QueryTypes.INSERT,
                transaction: tx
            });
        } catch (error) {
            console.error('Error inserting employee family:', error);
            throw error;
        }
    }

};

module.exports = EmployeeFamilyModel;
