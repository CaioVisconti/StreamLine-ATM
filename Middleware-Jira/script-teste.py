import socket

HOST = '3.91.44.210'
PORT = 65432

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))

    s.sendall(b"2")

    

    data = s.recv(1024)

    print(f"Recebido do servidor:\n {data.decode('utf-8')}")