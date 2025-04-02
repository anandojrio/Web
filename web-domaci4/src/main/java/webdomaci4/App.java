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
        ServletContext ctx = sce.getServletContext();
        Map<String, List<String>> weeklyMeals = new HashMap<>();

        loadMeals(ctx, weeklyMeals, "ponedeljak.txt", "Ponedeljak");
        loadMeals(ctx, weeklyMeals, "utorak.txt", "Utorak");
        loadMeals(ctx, weeklyMeals, "sreda.txt", "Sreda");
        loadMeals(ctx, weeklyMeals, "cetvrtak.txt", "Cetvrtak");
        loadMeals(ctx, weeklyMeals, "petak.txt", "Petak");

        ctx.setAttribute("weeklyMeals", weeklyMeals);

        String adminPassword = loadPassword(ctx);
        ctx.setAttribute("adminPassword", adminPassword);

        ctx.setAttribute("orders", new ConcurrentHashMap<String, Map<String, String>>());
    }

    private void loadMeals(ServletContext ctx, Map<String, List<String>> weeklyMeals, String fileName, String dayName) {
        try (InputStream is = ctx.getResourceAsStream("/resursi/" + fileName)) {
            List<String> meals = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.toList());
            weeklyMeals.put(dayName, meals);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load " + fileName, e);
        }
    }

    private String loadPassword(ServletContext ctx) {
        try (InputStream is = ctx.getResourceAsStream("/resursi/password.txt")) {
            return new BufferedReader(new InputStreamReader(is)).readLine().trim();
        } catch (IOException e) {
            throw new RuntimeException("Failed to load password.txt", e);
        }
    }
}
