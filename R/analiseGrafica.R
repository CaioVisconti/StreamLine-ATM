df <- projeto

head(df)

sumario <- summary(df[2:15])

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

# Define os intervalos manualmente para garantir a mesma escala
breaks_comum <- seq(min(df$RAMPercentual, df$CPUPercent), 
                    max(df$RAMPercentual, df$CPUPercent), 
                    length.out = 30)  

hist(df$RAMPercentual, 
     breaks = breaks_comum,
     main = "Distribuição do percentual de uso da RAM e CPU", 
     xlab = "Uso (%)", 
     col = rgb(1, 0, 0, 0.5), 
     border = "black",
     density = 50)

hist(df$CPUPercent, 
     breaks = breaks_comum,  
     col = rgb(0.5, 0, 0.5, 0.5),  
     border = "black",
     density = 50,
     add = TRUE) 

legend("topright", legend = c("RAM", "CPU"), 
       fill = c(rgb(1, 0, 0, 0.5), rgb(0.5, 0, 0.5, 0.5)), 
       border = "black")


graficoDensidadeCpu <- plot(density(df$CPUPercent), main = "Densidade de CPU", xlab = "Percentual de CPU", ylab = "Densidade", col = "blue")
graficoDensidadeRAM <- plot(density(df$RAMPercentual), main = "Densidade de RAM", xlab = "Percentual de RAM", ylab = "Densidade", col = "red")
graficoDensidadeDisco <- plot(density(df$DISKPercentual), main = "Densidade de Disco", xlab = "Percentual de Disco", ylab = "Densidade", col = "black")

mediaCpu <- mean(df$CPUPercent)
mediaRam <- mean(df$RAMPercentual)
mediaDisco <- mean(df$DISKPercentual)

pie(c(mediaRam, mediaCpu, mediaDisco),
    main = "Comparação entre o percentual de uso dos componentes",
    labels = round(c(mediaRam, mediaCpu, mediaDisco),2),
    col = c("lightblue", "lightgoldenrodyellow", "pink"))
    legend(x = "topright", legend = c("Média da CPU", "Média da RAM", "Média do Disco"),
           fill = c("lightblue", "lightgoldenrodyellow", "pink"))
    
somaCpu <- sum(df$CPUPercent)
somaRam <- sum(df$RAMPercentual)
somaDisco <- sum(df$DISKPercentual)

pie(c(somaRam, somaCpu, somaDisco),
    main = "Comparação entre as somas de uso dos componentes",
    labels = c(somaRam, somaCpu, somaDisco),
    col = c("lightsteelblue", "lightseagreen", "lightcyan"))
legend(x = "bottomleft", legend = c("Soma da RAM","Soma da CPU", "Soma do Disco"),
       fill = c("lightsteelblue", "lightseagreen", "lightcyan"))

