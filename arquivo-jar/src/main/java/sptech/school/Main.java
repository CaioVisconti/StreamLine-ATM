package sptech.school;

import com.github.javafaker.Faker;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {

        // AQUI É TUDO A RESPEITO DE DADOS DO USUÁRIO

        List<Usuario> usuario = new ArrayList<Usuario>();
        Faker faker = new Faker();

        for (int i = 0; i < 15; i++) {
            String nome = faker.name().fullName();
            Integer idade = faker.number().numberBetween(15,60);
            String profissao = faker.job().title();
            Double renda = faker.number().randomDouble(2, 1000, 10000);

            usuario.add(new Usuario(nome,idade,profissao,renda));
        }
        Usuario.ordenarUsuarios(usuario);
//        Usuario.ordenarPorIdade(usuario);
//        Usuario.ordenarPorRenda(usuario);
        for (int i = 0; i < usuario.size() -1; i++){
            System.out.println(usuario.get(i));
        }
        System.out.println(Usuario.pesquisaBinaria(usuario, 21));


        // AQUI COMEÇA O TRATAMENTO COM DADOS DE CAPTURAS

        List<Componentes> componentes = new ArrayList<Componentes>();
        String cp1, cp2, cp3;
        cp1 = "RAM";
        cp2 = "CPU";
        cp3 = "DISCO";

        for (int i = 0; i < 15; i++) {
        Double valor1 = faker.number().randomDouble(1, 2, 16);
        Double valor2 = faker.number().randomDouble(2, 1, 100);
        Double valor3 = faker.number().randomDouble(2, 50, 1000);
        componentes.add(new Componentes(cp1, valor1));
        componentes.add(new Componentes(cp2, valor2));
        componentes.add(new Componentes(cp3, valor3));

        }

        Componentes.ordenarComponentes(componentes);
        for (int i = 0; i < componentes.size() -1; i++) {
            System.out.println(componentes.get(i));

        }

    }


}