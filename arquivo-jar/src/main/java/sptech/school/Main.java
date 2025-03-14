package sptech.school;

import com.github.javafaker.Faker;

import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;


public class Main {
    public static void main(String[] args) {

        List<Usuario> usuario = new ArrayList<Usuario>();
        Faker faker = new Faker();
        Scanner scanner = new Scanner(System.in);
        long start = System.currentTimeMillis();
        Integer escolha;
        Integer escolha2;


        // criando a lista de objetos usuário
        for (int i = 0; i < 15; i++) {
            String nome = faker.name().fullName();
            Integer idade = faker.number().numberBetween(15,60);
            String profissao = faker.job().title();
            Double renda = faker.number().randomDouble(2, 1000, 10000);

            usuario.add(new Usuario(nome,idade,profissao,renda));
        }

        // INICIO
        System.out.println("Olá usuário, bem vindo ao nosso sistema de ordenação de dados!");
        System.out.println("Para prosseguir, informe que lista de dados deseja visualizar \n 1- Usuários \n 2- Componentes \n");

        while (true) {
            escolha = scanner.nextInt();
            if (escolha == 1) {
                System.out.println("Muito bem, agora nos informe o tipo de ordenação que deseja na visualização \n 1- Ordem alfabética \n 2- Idade \n 3- Renda \n");
                escolha2 = scanner.nextInt();
                if (escolha2 == 1) {
                    Usuario.ordenarUsuarios(usuario);
                    System.out.println("\n\n---------------------------------DADOS DE USUÁRIOS----------------------------------------\n");
                    for (int i = 0; i < usuario.size() - 1; i++) {
                        System.out.println(usuario.get(i));
                    }
                } else if (escolha2 == 2) {
                    Usuario.ordenarPorIdade(usuario);
                    System.out.println("\n\n---------------------------------DADOS DE USUÁRIOS----------------------------------------\n");
                    for (int i = 0; i < usuario.size() - 1; i++) {
                        System.out.println(usuario.get(i));
                    }
                } else if (escolha2 == 3) {
                    Usuario.ordenarPorRenda(usuario);
                    System.out.println("\n\n---------------------------------DADOS DE USUÁRIOS----------------------------------------\n");
                    for (int i = 0; i < usuario.size() - 1; i++) {
                        System.out.println(usuario.get(i));
                    }
                }

            } else if (escolha == 2) {
                System.out.println("Certo, os dados a seguir estão ordenados pela tipagem (ram, disco ou cpu)");
                List<Componentes> componentes = new ArrayList<Componentes>();
                String cp1, cp2, cp3;
                cp1 = "RAM";
                cp2 = "CPU";
                cp3 = "DISCO";

                for (int i = 0; i < 15; i++) {
                    int sortear = faker.number().numberBetween(1, 4);
                    if (sortear == 1) {
                        Double valor1 = faker.number().randomDouble(1, 2, 16);
                        componentes.add(new Componentes(cp1, valor1));
                    } else if (sortear == 2) {
                        Double valor2 = faker.number().randomDouble(2, 1, 100);
                        componentes.add(new Componentes(cp2, valor2));
                    } else if (sortear == 3) {
                        Double valor3 = faker.number().randomDouble(2, 50, 1000);
                        componentes.add(new Componentes(cp3, valor3));
                    }
                }
                System.out.println("\n\n---------------------------------DADOS DE COMPONENTES----------------------------------------\n");

                Componentes.ordenarComponentes(componentes);
                for (int i = 0; i < componentes.size() - 1; i++) {
                    System.out.println(componentes.get(i));

                }

            } else {
                System.out.println("Digite um número válido");
            }

        }
    }

}