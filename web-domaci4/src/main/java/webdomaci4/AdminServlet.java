package webdomaci4;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@WebServlet(name = "adminServlet", value = "/admin")
public class AdminServlet extends HttpServlet {

    private String validPassword;
    private Map<String, Map<String, String>> orders;
    private Map<String, List<String>> weeklyMeals;

    @Override
    public void init() throws ServletException {
        ServletContext server = getServletContext();
        validPassword = (String) server.getAttribute("adminPassword");
        orders = (ConcurrentHashMap<String, Map<String, String>>) server.getAttribute("orders");
        weeklyMeals = (Map<String, List<String>>) server.getAttribute("weeklyMeals");  // sva jela

        if (validPassword == null || orders == null || weeklyMeals == null) {  // provera inicijalizacije
            throw new ServletException("Failed to initialize. Ensure AppInitializer is correctly set up.");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        
        // AUTH
        String submittedPassword = request.getParameter("lozinka");
        if (!validPassword.equals(submittedPassword)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid credentials");
            return;
        }

        // BROJ JELA PO DANIMA
        Map<String, Map<String, Integer>> jelaPoDanu = new HashMap<>();
        List<String> sviDani = Arrays.asList("Ponedeljak", "Utorak", "Sreda", "Cetvrtak", "Petak");
        for (String day : sviDani) {
            jelaPoDanu.put(day, new HashMap<>());

            // sve inicijalizovati na 0
            List<String> meals = weeklyMeals.get(day);
            for (String meal : meals) {
                jelaPoDanu.get(day).put(meal, 0);
            }
        }

        // prolazi kroz sve i povecava sta treba
        synchronized (orders) {
            for (Map<String, String> userSelections : orders.values()) {
                for (Map.Entry<String, String> entry : userSelections.entrySet()) {
                    String dan = entry.getKey();
                    String jelo = entry.getValue();
                    jelaPoDanu.get(dan).put(jelo, jelaPoDanu.get(dan).getOrDefault(jelo, 0) + 1);
                }
            }
        }

        // PRIKAZ ATRANICE
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Admin Page</title>");
        out.println("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
        out.println("<style>");
        out.println("body { font-family: Arial, sans-serif; font-size: 18px; padding: 20px; }");
        out.println(".container { max-width: 800px; margin: 0 auto; }");
        out.println("h1, h2 { text-align: center; margin-bottom: 25px; font-weight: bold; }");
        out.println(".day-card { margin-bottom: 30px; padding: 20px; }");
        out.println(".meal-item { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; font-size: 18px; }");
        out.println(".no-meals { color: #6c757d; font-style: italic; text-align: center; }");
        out.println(".reset-button { margin-top: 15px; }");
        out.println("</style>");
        out.println("</head>");
        out.println("<body>");
        out.println("<div class=\"container\">");
        out.println("<h1>Pregled porudzbina</h1>");

        // PRIKAZ TABELE PO DANIMA
        for (String day : sviDani) {
            out.println("<div class=\"card day-card\">");
            out.println("<h2>" + day + "</h2>");

            Map<String, Integer> dayMeals = jelaPoDanu.get(day);
            out.println("<ul class=\"list-group\">");
            for (Map.Entry<String, Integer> mealEntry : dayMeals.entrySet()) {
                out.println("<li class=\"list-group-item meal-item\">");
                out.println("<span>" + mealEntry.getKey() + "</span>");
                out.println("<span class=\"badge bg-primary\">" + mealEntry.getValue() + "</span>");
                out.println("</li>");
            }
            out.println("</ul>");

            out.println("</div>");
        }

        out.println("<form method=\"POST\" class=\"text-center\">");
        out.println("<input type=\"hidden\" name=\"lozinka\" value=\"" + submittedPassword + "\">");
        out.println("<button type=\"submit\" class=\"btn btn-danger reset-button\">Očisti</button>");
        out.println("</form>");

        out.println("</div>");
        out.println("<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js\"></script>");
        out.println("</body></html>");
    }


    // OCISTI
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        orders.clear();
        response.sendRedirect("/admin?lozinka=" + request.getParameter("lozinka"));
    }
}


