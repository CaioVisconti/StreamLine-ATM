package sptech.school;

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

        return DriverManager.getConnection("jdbc:mysql://localhost/streamline?useTimezone=true&serverTimezone=UTC", "root", "admin!");
    }
}
