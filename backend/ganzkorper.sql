\echo 'Delete and recreate ganzkorper db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ganzkorper;
CREATE DATABASE ganzkorper;
\connect ganzkorper

\i ganzkorper-schema.sql
-- \i ganzkorper-seed.sql

\echo 'Delete and recreate ganzkorper_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ganzkorper_test;
CREATE DATABASE ganzkorper_test;
\connect ganzkorper_test

\i ganzkorper-schema.sql