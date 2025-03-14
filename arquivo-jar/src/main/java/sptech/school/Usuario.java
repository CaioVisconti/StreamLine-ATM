package sptech.school;
import com.sun.source.tree.BreakTree;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Usuario {

    private String nome;
    private Integer idade;
    private String profissao;
    private Double renda;

    public Usuario(String nome, Integer idade, String profissao, Double renda){
        this.nome = nome;
        this.idade = idade;
        this.profissao = profissao;
        this.renda = renda;
    }


    public String toString() {
        return "nome: " + nome + "  |  idade: " + idade + "  |  profissão: " + profissao + "  |  renda: " + renda;
    }

    public static void ordenarUsuarios(List<Usuario> lista){
        for (int i = 0; i < lista.size() -1; i++) {
            int indAtual = i;
            for (int j = i + 1; j < lista.size(); j++) {
                if (lista.get(j).nome.compareTo(lista.get(indAtual).nome) < 0){
                    indAtual = j;
                }
            }
            Usuario aux = lista.get(i);
            lista.set(i, lista.get(indAtual));
            lista.set(indAtual, aux);
        }
    }

    public static void ordenarPorIdade(List<Usuario> lista){
        for (int i = 0; i < lista.size()-1; i++){
            int indMenor = i;
            for (int j = i + 1; j < lista.size(); j++) {
                if (lista.get(j).idade < lista.get(indMenor).idade){
                    indMenor = j;
                }
            }
            Usuario aux = lista.get(i);
            lista.set(i, lista.get(indMenor));
            lista.set(indMenor, aux);
        }
    }

    public static void ordenarPorRenda(List<Usuario> lista){
        for (int i = 0; i < lista.size() -1; i++) {
            int indMenor = i;

            for (int j = i + 1; j < lista.size(); j++) {
                if (lista.get(j).renda < lista.get(indMenor).renda){
                    indMenor = j;
                }
            }
            Usuario aux = lista.get(i);
            lista.set(i, lista.get(indMenor));
            lista.set(indMenor, aux);
        }
    }

    public static int pesquisaBinaria(List<Usuario> lista, int x){
        Integer inicio = 0;
        Integer fim = lista.size();

        while (inicio <= fim){
            int meio = (inicio + fim) / 2;

            if (x == lista.get(meio).idade){
                return meio;
            } else if (x > lista.get(meio).idade){
                inicio = meio + 1;
            } else if (x < lista.get(meio).idade){
                fim = meio -1;
            }

        }
        return -1;
    }

}
