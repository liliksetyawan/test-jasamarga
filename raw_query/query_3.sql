-- INSERT data employee
INSERT INTO employee
(
    nik, name, is_active, start_date, end_date
)
VALUES
    ( '11012' , 'Budi', TRUE, '2022-12-12', '2029-12-12'),
    ( '11013' , 'Jarot', TRUE, '2021-09-01', '2028-09-01');

-- INSERT data employee_profile
INSERT INTO employee_profile
(
    employee_id, place_of_birth, date_of_birth, gender,
    is_married, prof_pict, created_at, created_by,
    updated_at, updated_by
)
VALUES
    ( 1, 'Jakarta', '1997-05-02', 'Laki-Laki', TRUE, '', '2022-12-12', 'admin', '2022-12-12', 'admin' ),
    ( 2, 'Sukabumi', '1996-05-02', 'Laki-Laki', FALSE, '', '2022-12-12', 'admin', '2022-12-12', 'admin');


-- INSERT data education
INSERT INTO education
(
    employee_id, name, level, description, created_at, created_by, updated_at, updated_by
)
VALUES
    ( 1, 'SMKN 7 Jakarta', 'SMA', 'Sekolah Menengah Atas', '2022-12-12', 'admin', '2022-12-12', 'admin'),
    ( 2, 'Universitas Negeri Yogyakarta', 'Strata 1', 'Sarjana', '2022-12-12', 'admin', '2022-12-12', 'admin');



-- INSERT data employee_family
INSERT INTO employee_family
(
    employee_id, name, identifier, job, place_of_birth, date_of_birth,
    religion, is_life, is_divorced, relation_status, created_at, created_by,
    updated_at, updated_by
)
VALUES
    (
        1, 'Marni', '32100594109960002', 'Ibu Rumah Tangga', 'Denpasar', '1995-10-17',
        'Islam', TRUE, FALSE, 'Istri', '2022-12-12', 'admin',
        '2012-12-12', 'admin'
    ),
    (
        1, 'Clara', '32100594109020004', 'Pelajar', 'Bangkalan', '2008-10-17',
        'Islam', TRUE, FALSE, 'Anak', '2022-12-12', 'admin',
        '2012-12-12', 'admin'
    ),
    (
        1, 'Stephanie', '32100594109020005', 'Pelajar', 'Bangkalan', '2008-10-17',
        'Islam', TRUE, FALSE, 'Anak', '2022-12-12', 'admin',
        '2012-12-12', 'admin'
    );