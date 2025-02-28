import mysql.connector

mydb = mysql.connector.connect(
  host="10.18.32.7",
  user="inseridor",
  password="urubu100",
  database="streamline"
)

mycursor = mydb.cursor()

print("Número do ATM  - Nome do ATM")
mycursor.execute("SELECT * from atm")
myresult = mycursor.fetchall()
for x in myresult:
  print(x)

maquina = int(input("Digite do ATM que deseja monitorar: "))

continuar = True

while continuar:
    opcao = input('Selecione uma opção: 1 - CPU | 2 - MEMÓRIA | 3 - DISCO | 4 - MÉDIA POR ATM | 5 - MEDIA GERAL')
    match opcao:
        case '1':            
            mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cpuUso as CPU , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
            myresult = mycursor.fetchall()

            for x in myresult:
                 print(f"ATM: {x[0]} | ID Captura: {x[1]} | Captura: {x[2]} | Data: {x[3]}")
        
        case '2':
            metrica = input("Qual tipo de medida deseja visualizar: 1 - Byte | 2 - Megabytes ")

            if metrica == '1':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, ramDisp as RAM , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | ID Captura: {x[1]} | Captura: {x[2]} | Data: {x[3]}")

            elif metrica == '2':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(ramDisp / 1048576 as float) as RAM , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | ID Captura: {x[1]} | Captura: {x[2]:.2f} | Data: {x[3]}")

        case '3':
            metrica = input("Qual tipo de medida deseja visualizar: 1 - Byte | 2 - Megabytes ")

            if metrica == '1':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, discoUso as DISCO , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | ID Captura: {x[1]} | Captura: {x[2]} | Data: {x[3]}")

            elif metrica == '2':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(discoUso / 1048576 as float) as DISCO , DATE_FORMAT(dtCaptura, '%h:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | ID Captura: {x[1]} | Captura: {x[2]:.2f} | Data: {x[3]}")

        case '4':
            metrica = input("Qual componente deseja visualizar a média: 1 - ram | 2 - disco | 3 - cpu")

            if metrica == '1':
                mycursor.execute(f"SELECT fkAtm as atm,round(avg(ramPorcent),2) as Ram FROM captura WHERE fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | Percentual: {x[1]}")

            elif metrica == '2':
                mycursor.execute(f"SELECT fkAtm as atm,round(avg(discoPorcent),2) as Disco FROM captura WHERE fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | Percentual: {x[1]}")
            
            elif metrica == '3':
                mycursor.execute(f"SELECT fkAtm as atm,round(avg(cpuUso),2) as Cpu FROM captura WHERE fkAtm = {maquina}")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"ATM: {x[0]} | Porcentual: {x[1]}")
            
        case '5':
            metrica = input("Qual componente deseja visualizar a média: 1 - ram | 2 - disco | 3 - cpu")

            if metrica == '1':
                mycursor.execute(f"SELECT round(avg(ramPorcent),2) as Ram FROM captura")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"Porcentual: {x[0]}")

            elif metrica == '2':
                mycursor.execute(f"SELECT round(avg(discoPorcent),2) as Disco FROM captura")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"Porcentual: {x[0]}")
            
            elif metrica == '3':
                mycursor.execute(f"SELECT round(avg(cpuUso),2) as Cpu FROM captura")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"Porcentual: {x[0]}")


    rodar = input("Deseja continuar vendo outras métricas? S/N ").lower()
    if rodar != 's':
        continuar = False

visualizar_outra_maquina = input("Deseja visualizar outra máquina? S/N ").lower()
if visualizar_outra_maquina == 's':
    maquina = int(input("Digite a máquina que deseja monitorar: "))
    continuar = True
else:
    print("Encerrando o programa.")
