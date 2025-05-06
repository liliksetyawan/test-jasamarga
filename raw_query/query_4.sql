SELECT
    e.id as employee_id, e.nik, e.name, e.is_active,
    ep.gender, EXTRACT(YEAR FROM AGE(ep.date_of_birth)) || ' Years Old' AS age, ed.name, ed.level,
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
    e.id, e.nik, e.name, e.is_active, ep.gender, ep.date_of_birth, ed.name, ed.level;