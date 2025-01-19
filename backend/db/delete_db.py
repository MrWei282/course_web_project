from flask import Flask
import psycopg2.pool

connection_pool = psycopg2.pool.SimpleConnectionPool(
                    minconn=1,
                    maxconn=10,
                    host='localhost',
                    port='5432',
                    database='postgres',
                    user='postgres',
                    password='root'
                )

conn = connection_pool.getconn()
cursor = conn.cursor()

cursor.execute("""
    DO $$ 
    DECLARE
        table_name text;
    BEGIN
        FOR table_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || table_name || ' CASCADE';
        END LOOP;
    END $$; """
)

conn.commit()

cursor.close()
connection_pool.putconn(conn)