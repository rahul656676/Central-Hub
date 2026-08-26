import psycopg2
try:
    conn = psycopg2.connect(host='localhost', port=5432, user='postgres', password='password')
    print('Connected successfully with postgres/password')
except Exception as e:
    print('Failed with postgres/password:', e)
