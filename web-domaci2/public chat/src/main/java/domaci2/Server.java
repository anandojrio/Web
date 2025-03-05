package domaci2;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.*;

public class Server {
    private static final int PORT = 9876; // broj prota koji se koristi
    private static Set<String> clientNames = new HashSet<>(); // hash da ne bi bilo ponavljanja
    private static List<Client> clients = new ArrayList<>(); // lista aktivnih klijenata
    private static List<String> istorijaPoruka = new LinkedList<>(); // poslednjih 100 poruka

    public static void main(String[] args) {
        System.out.println("Public chat se pokrece...");
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server slusa na portu " + PORT);

            while (true) {
                Socket socket = serverSocket.accept(); // prihvati novu konekciju
                System.out.println("Novi korisnik se ulogovao " + socket.getInetAddress());

                Client client = new Client(socket); // napravi novog klijenta
                clients.add(client);
                new Thread(client).start(); // novi thread za svakog klijenta
            }
        } catch (IOException e) {
            System.err.println("Greska u pokretanju servera: " + e.getMessage());
        }
    }

    // Broadcast svim ulogovanim i ne ulogovanim ljudima
    synchronized static void broadcastMessage(String poruka, boolean sacuvajUIstoriju) {
        if(sacuvajUIstoriju) {
            if (istorijaPoruka.size() >= 100) {
                istorijaPoruka.remove(0); // brise najstariju
            }
            istorijaPoruka.add(poruka);
        }
        for (Client client : clients) {
            client.posaljiPoruku(poruka);
        }
    }

    // veliki string za ispis kad se novi klijent uloguje
    synchronized static String getIstorijaPoruka() {
        StringBuilder history = new StringBuilder();
        for (String por : istorijaPoruka) {
            history.append(por).append("\n");
        }
        return history.toString();
    }

    // skidanje sa liste kad se disconnect
    synchronized static void removeClient(Client client, String username) {
        clients.remove(client);
//        clientNames.remove(username); // ako nije komentarisano mocice da se uloguje sa istim username
        broadcastMessage("Korisnik " + username + " je napustio chat.", false);
    }

    // username bez ponavljanja
    synchronized static boolean addClientName(String username) {
        return clientNames.add(username);
    }
}
