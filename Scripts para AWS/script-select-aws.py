import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="urubu100",
    database="streamline",
    ssl_disabled=True

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
    opcao = input(
    "\nSELECIONE UMA OPÇÃO    \n"
    "------------------------------\n"
    "[1]  - 🏎️  CPU\n"
    "[2]  - 🧠 MEMÓRIA\n"
    "[3]  - 💾 DISCO\n"
    "[4]  - 🏧 MÉDIA POR ATM\n"
    "[5]  - 📊 MÉDIA GERAL\n\n"

    "Digite o número da opção desejada: ")
    match opcao:
        case '1':           
            mycursor.execute(f"SELECT fkAtm as atm, idCaptura, valorCaptura as CPU , DATE_FORMAT(dtCaptura, '%H:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina} AND captura.tipoCaptura = 'Percentual de uso da CPU';")
            myresult = mycursor.fetchall()

            for x in myresult:
                 print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]}  | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]}%
------------------------------------------------------------
""")

        case '2':
            metrica = input(
    "QUAL TIPO DE MEDIDA DESEJA VISUALIZAR?   \n"
    "-----------------------------------------------\n"
    "[1]  - 🔹 Byte\n"
    "[2]  - 🔸 Megabytes\n"
    "[3]  - 🔻 Gigabytes\n\n"

    "Digite o número da opção desejada: "
    )

            if metrica == '1':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, valorCaptura as CPU , DATE_FORMAT(dtCaptura, '%H:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina} AND captura.tipoCaptura = 'RAM disponível';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]}  | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]}B
------------------------------------------------------------
""")

            elif metrica == '2':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(valorCaptura / 1048576 as float) as RAM, DATE_FORMAT(dtCaptura, '%H:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina} AND captura.tipoCaptura = 'RAM disponível';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]}  | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]:.2f}MB
------------------------------------------------------------
""")
                    
            elif metrica == '3':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(valorCaptura / 1073741824 as float) as RAM, DATE_FORMAT(dtCaptura, '%H:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina} AND captura.tipoCaptura = 'RAM disponível';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]}  | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]:.2f}GB
------------------------------------------------------------
""")

        case '3':
            metrica = input(
    "QUAL TIPO DE MEDIDA DESEJA VISUALIZAR?   \n"
    "-----------------------------------------------\n"
    "[1]  - 🔹 Byte\n"
    "[2]  - 🔸 Megabytes\n"
    "[3]  - 🔻 Gigabytes\n\n"

    "Digite o número da opção desejada: "
    )

            if metrica == '1':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, valorCaptura as DISCO , DATE_FORMAT(dtCaptura, '%H:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina} AND captura.tipoCaptura = 'Uso do disco';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]}  | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]}B
------------------------------------------------------------
""")

            elif metrica == '2':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(valorCaptura / 1048576 as float) as DISCO , DATE_FORMAT(dtCaptura, '%H:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina} AND captura.tipoCaptura = 'Uso do disco';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]}  | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]:.2f}MB
------------------------------------------------------------
""")
                    
            elif metrica == '3':
                mycursor.execute(f"SELECT fkAtm as atm, idCaptura, cast(valorCaptura / 1073741824 as float) as DISCO , DATE_FORMAT(dtCaptura, '%H:%i:%s %d/%m/%y') FROM captura JOIN atm on fkAtm = atm.idAtm WHERE captura.fkAtm = {maquina} AND captura.tipoCaptura = 'Uso do disco';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"""
------------------------------------------------------------
📊 N° Captura: {x[1]}  | ⏰ Data e Horário: {x[3]}
💳 ATM: {x[0]}      | 🔋 Dado capturado: {x[2]:.2f}GB
------------------------------------------------------------
""")

        case '4':
            metrica = input(    
    "QUAL COMPONENTE DESEJA VISUALIZAR A MÉDIA?   \n"
    "-----------------------------------------------\n"
    "[1]  - 🧠 RAM\n"
    "[2]  - 💾 DISCO\n"
    "[3]  - 🏎️ CPU\n\n"

    "Digite o número da opção desejada: ")

            if metrica == '1':
                mycursor.execute(f"SELECT a.modelo AS nomeAtm, round(avg(valorCaptura),2) as Cpu FROM captura AS c JOIN atm AS a ON c.fkAtm = a.idAtm WHERE fkAtm = {maquina} AND c.tipoCaptura = 'Percentual de uso da RAM';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"🏧 ATM Monitorado: {x[0]} | 📊 Percentual da média de uso: {x[1]}% 🔥")

            elif metrica == '2':
                mycursor.execute(f"SELECT a.modelo AS nomeAtm, round(avg(valorCaptura),2) as Cpu FROM captura AS c JOIN atm AS a ON c.fkAtm = a.idAtm WHERE fkAtm = {maquina} AND c.tipoCaptura = 'Percentual de uso do disco';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"🏧 ATM Monitorado: {x[0]} | 📊 Percentual da média de uso: {x[1]}% 🔥")
            
            elif metrica == '3':
                mycursor.execute(f"SELECT a.modelo AS nomeAtm, round(avg(valorCaptura),2) as Cpu FROM captura AS c JOIN atm AS a ON c.fkAtm = a.idAtm WHERE fkAtm = {maquina} AND c.tipoCaptura = 'Percentual de uso da CPU';")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"🏧 ATM Monitorado: {x[0]} | 📊 Percentual da média de uso: {x[1]}% 🔥")
            
        case '5':
            metrica = input(    
    "QUAL COMPONENTE DESEJA VISUALIZAR A MÉDIA?   \n"
    "-----------------------------------------------\n"
    "[1]  - 🧠 RAM\n"
    "[2]  - 💾 DISCO\n"
    "[3]  - 🏎️ CPU\n\n"

    "Digite o número da opção desejada: ")

            if metrica == '1':
                mycursor.execute(f"SELECT round(avg(valorCaptura),2) as Ram FROM captura WHERE tipoCaptura = 'Percentual de uso da RAM'")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"\nPercentual da média geral da memória RAM {x[0]}%")

            elif metrica == '2':
                mycursor.execute(f"SELECT round(avg(valorCaptura),2) as Disco FROM captura WHERE tipoCaptura = 'Percentual de uso do disco'")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"\nPercentual da média geral do disco: {x[0]}%")
            
            elif metrica == '3':
                mycursor.execute(f"SELECT round(avg(valorCaptura),2) as Cpu FROM captura WHERE tipoCaptura = 'Percentual de uso da CPU'")
                myresult = mycursor.fetchall()

                for x in myresult:
                    print(f"\nPercentual da média geral da CPU: {x[0]}%")


    rodar = input("\nDeseja continuar vendo outras métricas? S/N ").lower()
    if rodar != 's':
        continuar = False

visualizar_outra_maquina = input("\nDeseja visualizar outra máquina? S/N ").lower()
if visualizar_outra_maquina == 's':
    maquina = int(input("Digite a máquina que deseja monitorar: "))
    continuar = True
else:
    print("Encerrando o programa. Obrigado por utilizar nossa solução!")
