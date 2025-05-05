"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Create employee
        await queryInterface.createTable("employee", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            nik: { type: Sequelize.STRING, allowNull: true },
            name: { type: Sequelize.STRING },
            is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
            start_date: { type: Sequelize.DATE, allowNull: false },
            end_date: { type: Sequelize.DATE, allowNull: false },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            created_by: { type: Sequelize.STRING, allowNull: true },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updated_by: { type: Sequelize.STRING, allowNull: true },
        });

        // Create employee_profile
        await queryInterface.createTable("employee_profile", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            employee_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "employee", key: "id" },
                onDelete: "CASCADE",
            },
            place_of_birth: { type: Sequelize.STRING },
            date_of_birth: { type: Sequelize.DATE, allowNull: true },
            gender: { type: Sequelize.ENUM("Laki-Laki", "Perempuan"), allowNull: true },
            is_married: { type: Sequelize.BOOLEAN, defaultValue: false },
            prof_pict: { type: Sequelize.STRING(255), allowNull: true },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            created_by: { type: Sequelize.STRING(255), allowNull: true },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updated_by: { type: Sequelize.STRING(255), allowNull: true },
        });

        // Create education
        await queryInterface.createTable("education", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            employee_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "employee", key: "id" },
                onDelete: "CASCADE",
            },
            name: { type: Sequelize.STRING(255), allowNull: true },
            level: {
                type: Sequelize.ENUM("TK", "SD", "SMP", "SMA", "Strata 1", "Strata 2", "Doktor", "Profesor"),
                allowNull: true,
            },
            description: { type: Sequelize.STRING(255), allowNull: false },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            created_by: { type: Sequelize.STRING(255), allowNull: false },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updated_by: { type: Sequelize.STRING(255), allowNull: false },
        });

        // Create employee_family
        await queryInterface.createTable("employee_family", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            employee_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "employee", key: "id" },
                onDelete: "CASCADE",
            },
            name: { type: Sequelize.STRING(255), allowNull: true },
            identifier: { type: Sequelize.STRING(255), allowNull: true },
            job: { type: Sequelize.STRING(255), allowNull: true },
            place_of_birth: { type: Sequelize.STRING },
            date_of_birth: { type: Sequelize.DATE, allowNull: true },
            religion: {
                type: Sequelize.ENUM("Islam", "Katolik", "Buddha", "Protestan", "Konghucu"),
                allowNull: true,
            },
            if_life: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
            if_divorced: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            relation_status: {
                type: Sequelize.ENUM("Suami", "Istri", "Anak", "Anak Sambung"),
                allowNull: true,
            },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            created_by: { type: Sequelize.STRING(255), allowNull: false },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updated_by: { type: Sequelize.STRING(255), allowNull: false },
        });
    },

    async down(queryInterface, Sequelize) {
        // Drop children tables first due to foreign key constraints
        await queryInterface.dropTable("employee_family");
        await queryInterface.dropTable("education");
        await queryInterface.dropTable("employee_profile");
        await queryInterface.dropTable("employee");

        // Drop ENUM types
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_employee_profile_gender";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_education_level";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_employee_family_religion";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_employee_family_relation_status";');
    },
};
