const { sequelize } = require('../config/database');

const EducationModel = {
    async insertEducation(education, tx) {
        const query = `
            INSERT INTO education
                (
                    employee_id, name, level, description, 
                    created_at, created_by, updated_at, updated_by
                )
            VALUES 
                (
                    $1, $2, $3, $4,
                    NOW(), 'admin', NOW(), 'admin'
                )
            RETURNING id;
        `;

        try {
            const [result] = await sequelize.query(query, {
                bind: [
                    education.employee_id,
                    education.name,
                    education.level,
                    education.description
                ],
                type: sequelize.QueryTypes.INSERT,
                transaction: tx
            });
            return result;
        } catch (error) {
            console.error('Error inserting education:', error);
            throw error;
        }
    },

    async deleteByEmployeeId(employee_id, tx) {
        try {
            await sequelize.query('DELETE FROM education WHERE employee_id = $1', {
                bind: [employee_id],
                type: sequelize.QueryTypes.DELETE,
                transaction: tx
            });
        } catch (error) {
            console.error('Error deleting education:', error);
            throw error;
        }
    },

    async insertEmployeeEducation(education, tx) {
        const query = `
        INSERT INTO education
            (employee_id, name, level, description, created_at, created_by, updated_at, updated_by)
        VALUES
            ($1, $2, $3, $4, NOW(), 'admin', NOW(), 'admin')
    `;

        try {
            await sequelize.query(query, {
                bind: [
                    education.employee_id,
                    education.name,
                    education.level,
                    education.description
                ],
                type: sequelize.QueryTypes.INSERT,
                transaction: tx
            });
        } catch (error) {
            console.error('Error inserting education:', error);
            throw error;
        }
    }

};

module.exports = EducationModel;
