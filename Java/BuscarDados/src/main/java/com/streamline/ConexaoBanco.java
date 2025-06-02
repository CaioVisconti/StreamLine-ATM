package com.streamline;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoBanco {
    public static Connection conectar() throws SQLException {
        try{
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e){
            System.out.println("Erro ao tentar encontrar o driver Mysql! " + e.getMessage());
        }

        return DriverManager.getConnection("jdbc:mysql://52.20.218.110/streamline?useTimezone=true&serverTimezone=UTC", "root", "admin!");
    }
}