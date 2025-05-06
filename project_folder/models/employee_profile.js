const { sequelize } = require('../config/database');

const EmployeeProfileModel = {
    async insertEmployeeProfile(profile, tx) {
        const query = `
        INSERT INTO employee_profile
            (
                employee_id, place_of_birth, date_of_birth, gender,
                is_married, prof_pict, created_at, created_by,
                updated_at, updated_by
            )
        VALUES 
            (
                $1, $2, $3, $4, 
                $5, $6, NOW(), 'admin', 
                NOW(), 'admin'
            )
        RETURNING id;
        `;

        try {
            const [result] = await sequelize.query(query, {
                bind: [
                    profile.employee_id,
                    profile.place_of_birth,
                    profile.date_of_birth,
                    profile.gender,
                    profile.is_married,
                    profile.prof_pict
                ],
                type: sequelize.QueryTypes.INSERT,
                transaction: tx
            });
            return result;
        } catch (error) {
            console.error('Error inserting employee profile:', error);
            throw error;
        }
    },

    async updateEmployeeProfile(profile, tx) {
        const query = `
        UPDATE employee_profile SET
            place_of_birth = $1,
            date_of_birth = $2,
            gender = $3,
            is_married = $4,
            updated_at = NOW()
        WHERE employee_id = $5
    `;

        try {
            await sequelize.query(query, {
                bind: [
                    profile.place_of_birth,
                    profile.date_of_birth,
                    profile.gender,
                    profile.is_married,
                    profile.employee_id
                ],
                type: sequelize.QueryTypes.UPDATE,
                transaction: tx
            });
        } catch (error) {
            console.error('Error updating employee profile:', error);
            throw error;
        }
    },

    async deleteByEmployeeId(employeeId, transaction) {
        return await sequelize.query(
            'DELETE FROM employee_profile WHERE employee_id = :employeeId',
            {
                replacements: { employeeId },
                transaction
            }
        );
    }


};



module.exports = EmployeeProfileModel;
