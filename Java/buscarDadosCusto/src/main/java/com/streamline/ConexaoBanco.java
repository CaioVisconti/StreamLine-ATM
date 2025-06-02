package com.streamline;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoBanco {
    public static Connection conectar() throws SQLException {
        String url = "jdbc:mysql://52.20.218.110:3306/streamline?useTimezone=true&serverTimezone=UTC";
        String user = System.getenv("root"); // Defina DB_USER na Lambda
        String password = System.getenv("urubu100"); // Defina DB_PASSWORD na Lambda

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.out.println("Erro ao tentar encontrar o driver Mysql! " + e.getMessage());
        }

        return DriverManager.getConnection(url, user, password);
    }
}