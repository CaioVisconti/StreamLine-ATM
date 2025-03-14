package sptech.school;

import java.lang.module.Configuration;
import java.time.LocalDate;
import java.util.List;

public class Componentes {

    private String tipo;
    private Double valor;
    private LocalDate dtCaptura = LocalDate.now();

    public Componentes(String tipo, Double valor){
        this.tipo = tipo;
        this.valor = valor;
    }

    @Override
    public String toString() {
        return "Tipo: " + tipo +" | Valor: " + valor +" | Data: " + dtCaptura;
    }

    public static void ordenarComponentes(List<Componentes> list){
        for (int i = 0; i < list.size() -1; i++) {
            int indMenor = i;
            for (int j = i + 1; j < list.size(); j++) {
                if (list.get(j).tipo.compareTo(list.get(indMenor).tipo) < 0){
                    indMenor = j;
                }
            }
            Componentes aux = list.get(i);
            list.set(i, list.get(indMenor));
            list.set(indMenor, aux);
        }
    }


}
