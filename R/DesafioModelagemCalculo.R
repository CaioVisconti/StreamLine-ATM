library(DescTools)

df <- projeto
df2 <- maquina.2

head(df)

sumario <- summary(df[2:15])
summary(df2[2:15])

# graficos simples e histogramas
histogramaCpuPercent <- hist(df$CPUPercent, 
                             main = "Distribuição do Uso da CPU", 
                             xlab = "Uso da CPU (%)", 
                             col = "cyan", 
                             border = "black",
                             density = 70)

histogramaRamPercent <- hist(df$RAMPercentual, 
                             main = "Distribuição do Uso da RAM", 
                             xlab = "Uso da RAM (%)", 
                             col = "red", 
                             border = "black",
                             density = 70)

histogramaDiscoPercent <- hist(df$DISKPercentual, 
                             main = "Distribuição do Uso do Disco", 
                             xlab = "Pacotes Recebidos", 
                             col = "purple", 
                             border = "black",
                             density = 70)

graficoDensidadeCpu <- plot(density(df$CPUPercent), 
                            main = "Densidade de CPU", 
                            xlab = "Percentual de CPU", 
                            ylab = "Densidade", 
                            col = "blue")

graficoDensidadeRAM <- plot(density(df$RAMPercentual), 
                            main = "Densidade de RAM", 
                            xlab = "Percentual de RAM", 
                            ylab = "Densidade", 
                            col = "red")

graficoDensidadeDisco <- plot(density(df$DISKPercentual), 
                              main = "Densidade de Disco", 
                              xlab = "Percentual de Disco", 
                              ylab = "Densidade", 
                              col = "black")

# calculo de medias
mediaCpu <- mean(df$CPUPercent)
mediaRam <- mean(df$RAMPercentual)
mediaDisco <- mean(df$DISKPercentual)

pie(c(mediaRam, mediaCpu, mediaDisco),
    main = "Comparação entre o percentual de uso dos componentes",
    labels = round(c(mediaRam, mediaCpu, mediaDisco),2),
    col = c("lightblue", "lightgoldenrodyellow", "pink"))
    legend(x = "topright", legend = c("Média da CPU", "Média da RAM", "Média do Disco"),
           fill = c("lightblue", "lightgoldenrodyellow", "pink"))

# calculo de somas    
somaCpu <- sum(df$CPUPercent)
somaRam <- sum(df$RAMPercentual)
somaDisco <- sum(df$DISKPercentual)

pie(c(somaRam, somaCpu, somaDisco),
    main = "Comparação entre as somas de uso dos componentes",
    labels = c(somaRam, somaCpu, somaDisco),
    col = c("lightsteelblue", "lightseagreen", "lightcyan"))
legend(x = "bottomleft", legend = c("Soma da RAM","Soma da CPU", "Soma do Disco"),
       fill = c("lightsteelblue", "lightseagreen", "lightcyan"))

# analise de picos de cpu ram e disco

maxCpu1 <- max(df$CPUPercent)
maxRam1 <- max(df$RAMPercentual)
maxDisco1 <- max(df$DISKPercentual)

maxCpu2 <- max(df2$CPUPercent)
maxRam2 <- max(df2$RAMPercentual)
maxDisco2 <- max(df2$DISKPercentual)

pie(c(maxCpu1, maxCpu2),
    main = "Análise de picos de CPU por maquina",
    col = c("lightblue", "pink"),
    labels = c(maxCpu1, maxCpu2))
legend(x = "topright", legend = c("Pico da máquina 1", "Pico da máquina 2"),
       fill = c("lightblue", "pink"))

pie(c(maxRam1, maxRam2),
    main = "Análise de picos de CPU por maquina",
    col = c("lightblue", "pink"),
    labels = c(maxRam1, maxRam2))
legend(x = "topright", legend = c("Pico da máquina 1", "Pico da máquina 2"),
       fill = c("lightblue", "pink"))

pie(c(maxDisco1, maxDisco2),
    main = "Análise de picos de CPU por maquina",
    col = c("lightblue", "pink"),
    labels = c(maxDisco1, maxDisco2))
legend(x = "topright", legend = c("Pico da máquina 1", "Pico da máquina 2"),
       fill = c("lightblue", "pink"))

# comparacao de desempenho entre cpus de maquinas 

hist(df$CPUPercent,
     main = "Desempenho do Uso da CPU (01 máquina)", 
     xlab = "Uso da CPU (%)", 
     col = "lightpink")

hist(df2$CPUPercent,
     main = "Desempenho do Uso da CPU (02 máquina)", 
     xlab = "Uso da CPU (%)", 
     col = "lightblue")

hist(c(df$CPUPercent, df2$CPUPercent),
     main = "Desempenho do Uso da CPU por máquinas", 
     xlab = "Uso da CPU (%)", 
     col = c("lightpink", "lightblue"))
legend(x = "topright", legend = c("Máquina 1", "Máquina 2"),
       fill = c("lightpink", "lightblue"))

# comparacao de uso entre periodos (dia tarde e noite)

segundos1 <- factor(df$dtHora,
                    levels = df$dtHora,
                    label = c(1: length(df$dtHora)))
segundos1

segundos2 <- factor(df2$dtHora,
                    levels = df2$dtHora,
                    label = c(1: length(df2$dtHora)))

resultadoCPUPercentual1 = segundos1[df$CPUPercent == Mode(df$CPUPercent)]
resultadoCPUPercentual2 = segundos2[df2$CPUPercent == Mode(df2$CPUPercent)]

cat("O uso percentual da CPU esteve em alta no intervalo de ", df$dtHora[resultadoCPUPercentual1[1]], " e ", df$dtHora[resultadoCPUPercentual1[length(resultadoCPUPercentual1)]], " da primeira máquina e o intervalo de ", df2$dtHora[resultadoCPUPercentual2[1]], " e ", df2$dtHora[resultadoCPUPercentual2[length(resultadoCPUPercentual2)]], " da segunda máquina")

resultadoRAMPercentual1 = segundos1[df$RAMPercentual == Mode(df$RAMPercentual)]
resultadoRAMPercentual2 = segundos2[df2$RAMPercentual == Mode(df2$RAMPercentual)]

cat("O uso percentual da memória RAM esteve em alta no intervalo de ", df$dtHora[resultadoRAMPercentual1[1]], " e ", df$dtHora[resultadoRAMPercentual1[length(resultadoRAMPercentual1)]], " da primeira máquina e o intervalo de ", df2$dtHora[resultadoRAMPercentual2[1]], " e ", df2$dtHora[resultadoRAMPercentual2[length(resultadoRAMPercentual2)]], " da segunda máquina")

resultadoDISKPercentual1 = segundos1[df$DISKPercentual == Mode(df$DISKPercentual)]
resultadoDISKPercentual2 = segundos2[df2$DISKPercentual == Mode(df2$DISKPercentual)]

cat("O uso percentual do Disco esteve em alta no intervalo de ", df$dtHora[resultadoDISKPercentual1[1]], " e ", df$dtHora[resultadoDISKPercentual1[length(resultadoDISKPercentual1)]], " da primeira máquina e o intervalo de ", df2$dtHora[resultadoRAMPercentual2[1]], " e ", df2$dtHora[resultadoDISKPercentual2[length(resultadoDISKPercentual2)]], " da segunda máquina")

