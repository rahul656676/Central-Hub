import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
try:
    conn = psycopg2.connect(host='localhost', port=5432, user='postgres', password='password')
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    cursor.execute('CREATE DATABASE centralhub')
    print('Database centralhub created.')
except Exception as e:
    print('Error:', e)
