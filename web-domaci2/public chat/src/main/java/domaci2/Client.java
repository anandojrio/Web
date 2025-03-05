package domaci2;

import java.io.*;
import java.net.Socket;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

class Client implements Runnable {

    private static final String SERVER_ADDRESS = "127.0.0.1"; // localhost
    private static final int SERVER_PORT = 9876; // isti port kao server
    private Socket socket; // socket
    private PrintWriter out;
    private BufferedReader in;
    private String username;

    public Client(Socket socket) {
        this.socket = socket;
    }

    public static void main(String[] args) {
        BufferedReader in;
        PrintWriter out;

        try (Socket socket = new Socket(SERVER_ADDRESS, SERVER_PORT)) {
            System.out.println("Connected to the chat server.");

            // Input and output streams
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            out = new PrintWriter(socket.getOutputStream(), true);

            // thread koji cita poruke sa servera
            new Thread(() -> {
                try {
                    String response;
                    while ((response = in.readLine()) != null) {
                        System.out.println(response); // prikazuje poruke sa servera
                    }
                } catch (IOException e) {
                    System.err.println("Connection closed by the server.");
                }
            }).start();

            // thread koji cita liniju i salje poruke serveru
            Scanner scanner = new Scanner(System.in);
            while (true) {
                String input = scanner.nextLine();
                if (input.equalsIgnoreCase("/quit")) { // komanda za izlaz iz chata
                    break;
                }
                out.println(input); // salje poruku serveru
            }
        } catch (IOException e) {
            System.err.println("Error connecting to the server: " + e.getMessage());
        }
    }

    @Override
    public void run() {
        try (
                InputStream input = socket.getInputStream();
                OutputStream output = socket.getOutputStream();
                BufferedReader in = new BufferedReader(new InputStreamReader(input));
                PrintWriter out = new PrintWriter(output, true)
        ) {
            this.in = in;
            this.out = out;

            // beskonacna petlja dok ne da dobar username
            while (true) {
                out.println("Enter your username:");
                username = in.readLine();
                if (username == null || username.isEmpty()) continue;

                synchronized (Server.class) {
                    if (Server.addClientName(username)) {
                        break; // dostupan username
                    } else {
                        out.println("Username je zauzet, probajte drugi");
                    }
                }
            }

            out.println("Dobrodosli u public chat, " + username + "!");
            Server.broadcastMessage("Korisnik " + username + " se ukljucio u chat.", false);

            // print ceo dosadasnji chat
            out.println(Server.getIstorijaPoruka());

            String message;
            while ((message = in.readLine()) != null) {
                String konacnaPoruka = new Date() + " - " + username + ": " + cenzurisi(message);
                Server.broadcastMessage(konacnaPoruka, true);
            }
        } catch (IOException e) {
            System.err.println("Error handling client: " + e.getMessage());
        } finally {
            Server.removeClient(this, username);
            try { socket.close(); } catch (IOException ignored) { }
        }
    }

    public void posaljiPoruku(String message) {
        out.println(message);
    }

    private String cenzurisi(String message) {
        List<String> censoredWords = Arrays.asList("pederu", "ruzansi");
        for (String word : censoredWords) {
            if (message.contains(word)) {
                int duzinaReci = word.length();
                String replacement = word.charAt(0) + "*".repeat(duzinaReci - 2) + word.charAt(duzinaReci - 1);
                message = message.replace(word, replacement);
            }
        }
        return message;
    }
}
