import mysql.connector

mydb = mysql.connector.connect(
  host="10.18.32.7",
  user="inseridor",
  password="urubu100",
  database="streamline"
)

mycursor = mydb.cursor()

print(f"{'\nNúmero do ATM':<20} {'Nome do ATM'}")
print('-' * 40)

mycursor.execute("SELECT idAtm, modelo FROM atm")
myresult = mycursor.fetchall()

for x in myresult:
    print(f"{x[0]:<20} {x[1]}")

print("\n")


maquina = int(input("Digite o número do ATM que deseja monitorar: "))

continuar = True

while continuar:
    opcao = input('Selecione uma opção:\n1 - CPU\n2 - MEMÓRIA\n3 - DISCO\n4 - MÉDIA POR ATM\n5 - MEDIA GERAL\n')
    match opcao:
        case '1':           
            mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cpuUso as CPU , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
            myresult = mycursor.fetchall()

            for x in myresult:
                 print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]} | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]}%
------------------------------------------------------------
""")

        case '2':
            metrica = input("Qual tipo de medida deseja visualizar:\n1 - Byte\n2 - Megabytes\n ")

            if metrica == '1':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, ramDisp as RAM , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]} | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]}B
------------------------------------------------------------
""")

            elif metrica == '2':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(ramDisp / 1048576 as float) as RAM , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]} | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]:.2f}MB
------------------------------------------------------------
""")

        case '3':
            metrica = input("Qual tipo de medida deseja visualizar:\n1 - Byte\n2 - Megabytes\n ")

            if metrica == '1':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, discoUso as DISCO , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]} | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]}B
------------------------------------------------------------
""")

            elif metrica == '2':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(discoUso / 1048576 as float) as DISCO , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]} | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]:.2f}MB
------------------------------------------------------------
""")

        case '4':
            metrica = input("Qual componente deseja visualizar a média:\n1 - RAM\n2 - DISCO\n3 - CPU\n")

            if metrica == '1':
                mycursor.execute(f"SELECT a.modelo AS nomeAtm, round(avg(ramPorcent),2) as Cpu FROM captura AS c JOIN atm AS a ON c.fkAtm = a.idAtm WHERE fkAtm = {maquina};")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | Percentual: {x[1]}%")

            elif metrica == '2':
                mycursor.execute(f"SELECT a.modelo AS nomeAtm, round(avg(discoPorcent),2) as Cpu FROM captura AS c JOIN atm AS a ON c.fkAtm = a.idAtm WHERE fkAtm = {maquina};")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | Percentual: {x[1]}%")
            
            elif metrica == '3':
                mycursor.execute(f"SELECT a.modelo AS nomeAtm, round(avg(cpuUso),2) as Cpu FROM captura AS c JOIN atm AS a ON c.fkAtm = a.idAtm WHERE fkAtm = {maquina};")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | Percentual: {x[1]}%")
            
        case '5':
            metrica = input("Qual componente deseja visualizar a média:\n1 - RAM\n2 - DISCO\n3 - CPU\n")

            if metrica == '1':
                mycursor.execute(f"SELECT round(avg(ramPorcent),2) as Ram FROM captura")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"Percentual da média geral: da memória RAM {x[0]}%")

            elif metrica == '2':
                mycursor.execute(f"SELECT round(avg(discoPorcent),2) as Disco FROM captura")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"Percentual da média geral do disco: {x[0]}%")
            
            elif metrica == '3':
                mycursor.execute(f"SELECT round(avg(cpuUso),2) as Cpu FROM captura")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"Percentual da média geral da CPU: {x[0]}%")


    rodar = input("Deseja continuar vendo outras métricas? S/N ").lower()
    if rodar != 's':
        continuar = False

visualizar_outra_maquina = input("Deseja visualizar outra máquina? S/N ").lower()
if visualizar_outra_maquina == 's':
    maquina = int(input("Digite a máquina que deseja monitorar: "))
    continuar = True
else:
    print("Encerrando o programa.")
