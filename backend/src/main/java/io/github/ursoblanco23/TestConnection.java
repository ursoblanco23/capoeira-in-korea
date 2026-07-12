package io.github.ursoblanco23;

import java.sql.Connection;
import java.sql.DriverManager;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/capoeira_korea_dev";
        String user = "capo_dev";
        String password = "capo";

        try {
            System.out.println("Connecting to database...");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connection successful!");
            conn.close();
        } catch (Exception e) {
            System.err.println("Connection failed!");
            e.printStackTrace();
        }
    }
}
