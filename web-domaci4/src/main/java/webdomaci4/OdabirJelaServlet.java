package webdomaci4;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@WebServlet(name = "odabirJelaServlet", value = "/select-meals")
public class OdabirJelaServlet extends HttpServlet {

    private Map<String, List<String>> weeklyMeals;
    private Map<String, Map<String, String>> orders;

    @Override
    public void init() throws ServletException {
        ServletContext server = getServletContext();

        // POKUPI PODATKE SA SERVERA
        weeklyMeals = (Map<String, List<String>>) server.getAttribute("weeklyMeals");
        orders = (ConcurrentHashMap<String, Map<String, String>>) server.getAttribute("orders");

        if (weeklyMeals == null || orders == null) {
            throw new ServletException("Failed to initialize. Ensure AppInitializer is correctly set up.");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        // PRAVI INSTANCE
        HttpSession session = request.getSession();
        Map<String, String> izabranaJela = (Map<String, String>) session.getAttribute("selectedMeals");

        // orders resetovan ali session od ove instance nije
        if (izabranaJela != null && !orders.containsKey(session.getId())) {
            // OCISTI
            session.removeAttribute("selectedMeals");
            izabranaJela = null;
        }

        // ERROR CASE       VEC IZABRAO SVOJE OBROKE
        if (izabranaJela != null) {
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("<!DOCTYPE html>");
            out.println("<html lang=\"en\">");
            out.println("<head>");
            out.println("<meta charset=\"UTF-8\">");
            out.println("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
            out.println("<title>Moja porudzbina</title>");
            out.println("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
            out.println("<style>");
            out.println("h1 {margin-top: 15px; margin-bottom: 15px;}");
            out.println("body { font-family: Arial, sans-serif; font-size: 18px; padding: 20px; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f9fa; }");
            out.println(".container { max-width: 600px; text-align: center; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }");
            out.println(".alert { margin-bottom: 30px; }");
            out.println(".list-group-item { font-size: 18px; }");
            out.println("</style>");
            out.println("</head>");
            out.println("<body>");
            out.println("<div class=\"container\">");
            out.println("<div class=\"alert alert-danger\" role=\"alert\">Vec ste odabrali sta cete jesti ove nedelje.</div>");
            out.println("<h1>Moj rucak ove nedelje:</h1>");
            out.println("<ul class=\"list-group\">");

            for (Map.Entry<String, String> entry : izabranaJela.entrySet()) {
                out.println("<li class=\"list-group-item\">" + entry.getKey() + ": " + entry.getValue() + "</li>");
            }

            out.println("</ul>");
            out.println("</div>");
            out.println("<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js\"></script>");
            out.println("</body>");
            out.println("</html>");
        } else {
            // MOZE DA BIRA
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Meal Selection</title>");
            out.println("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
            out.println("<style>");
            out.println("body { font-family: Arial, sans-serif; font-size: 18px; padding: 20px; }");
            out.println(".container { max-width: 600px; margin: 0 auto; }");
            out.println("h1 { text-align: center; margin-bottom: 30px; }");
            out.println(".form-group { margin-bottom: 25px; }");
            out.println("label { font-weight: bold; margin-bottom: 10px; display: block; }");
            out.println(".submit-btn { margin-top: 30px; }");
            out.println("</style>");
            out.println("</head>");
            out.println("<body>");
            out.println("<div class=\"container\">");
            out.println("<h1>Odaberite vas rucak:</h1>");
            out.println("<form method=\"POST\" action=\"/select-meals\">");

            // morao sam ovako zbog redosleda
            List<String> sviDani = Arrays.asList("Ponedeljak", "Utorak", "Sreda", "Cetvrtak", "Petak");
            // dropdown menu
            for (String day : sviDani) {
                out.println("<div class=\"form-group\">");
                out.println("<label for=\"" + day.toLowerCase() + "\">" + day + ":</label>");
                out.println("<select id=\"" + day.toLowerCase() + "\" name=\"" + day + "\" class=\"form-select form-select-lg\">");

                List<String> jelaZaTajDan = weeklyMeals.get(day);
                for (String meal : jelaZaTajDan) {
                    out.println("<option value=\"" + meal + "\">" + meal + "</option>");
                }

                out.println("</select>");
                out.println("</div>");
            }

            out.println("<div class=\"text-center\">");
            out.println("<button type=\"submit\" class=\"btn btn-primary btn-lg submit-btn\">Potvrdite unos</button>");
            out.println("</div>");
            out.println("</form>");
            out.println("</div>");
            out.println("<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js\"></script>");
            out.println("</body></html>");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(true);

        // vec izabrao
        if (session.getAttribute("selectedMeals") != null) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Order already submitted");
            return;
        }

        Map<String, String> korisnikovIzbor = new HashMap<>();
        weeklyMeals.keySet().forEach(day -> {
            String meal = request.getParameter(day);
            if (meal != null) {
                korisnikovIzbor.put(day, meal);
            }
        });

        // sacuva se na serveru
        // beat the race
        synchronized (orders) {
            orders.put(session.getId(), korisnikovIzbor);
        }

        // sacuva se za korisnika
        session.setAttribute("selectedMeals", korisnikovIzbor);

        // USPEH
        response.sendRedirect("potvrda.html");
    }
}
