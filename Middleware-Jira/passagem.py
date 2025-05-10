import mysql.connector
from mysql.connector import errorcode
from datetime import datetime
import socket

HOST = '3.91.44.210'
PORT = 65432

def criacaoSocket():
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		s.bind((HOST, PORT))
		s.listen()

		conexaoRemota = s.accept()
		with conexaoRemota:
			while True:
				data = conexaoRemota.recv(1024)
				if not data:
					break

				mensagem = data.decode('utf-8')

				lista = carregarDados(mensagem)
				print(f"Recebido: {mensagem}")
				conexaoRemota.sendall(lista) # corrigir pra binario

			print("Conexão encerrada")

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="rootPI",
        password="Urubu#100",
        database="streamline",
    )

def carregarDados(fkAtm):
	conexao = conectar()
	cursor = conexao.cursor()
	sql = "SELECT * FROM parametrizacao WHERE fkAtm = ?;"

	cursor.execute(sql, fkAtm)
	resultado = cursor.fetchall()

	return resultado

criacaoSocket()