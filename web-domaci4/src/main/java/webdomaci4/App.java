package webdomaci4;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@WebListener
public class App implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext server = sce.getServletContext(); //zajednicko baratanje atributima
        Map<String, List<String>> svaJela = new HashMap<>();

        ucitajObroke(server, svaJela, "ponedeljak.txt", "Ponedeljak");
        ucitajObroke(server, svaJela, "utorak.txt", "Utorak");
        ucitajObroke(server, svaJela, "sreda.txt", "Sreda");
        ucitajObroke(server, svaJela, "cetvrtak.txt", "Cetvrtak");
        ucitajObroke(server, svaJela, "petak.txt", "Petak");

        server.setAttribute("weeklyMeals", svaJela);

        String adminPassword = ucitajPassword(server);
        server.setAttribute("adminPassword", adminPassword);

        server.setAttribute("orders", new ConcurrentHashMap<String, Map<String, String>>());
    }

    private void ucitajObroke(ServletContext server, Map<String, List<String>> svaJela, String fileName, String dayName) {
        try (InputStream in = server.getResourceAsStream("/WEB-INF/resursi/" + fileName)) {
            if (in == null) {
                throw new RuntimeException("Failed to load resource: " + fileName + ". Check if the file exists in /resursi/");
            }
            List<String> meals = new BufferedReader(new InputStreamReader(in))
                    .lines()
                    .collect(Collectors.toList());
            svaJela.put(dayName, meals);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load " + fileName, e);
        }
    }

    private String ucitajPassword(ServletContext server) {
        try (InputStream in = server.getResourceAsStream("/WEB-INF/resursi/password.txt")) {
            if (in == null) {
                throw new RuntimeException("Failed to load resource: password.txt. Check if the file exists in /resursi/");
            }
            return new BufferedReader(new InputStreamReader(in)).readLine().trim();
        } catch (IOException e) {
            throw new RuntimeException("Failed to load password.txt", e);
        }
    }
}
