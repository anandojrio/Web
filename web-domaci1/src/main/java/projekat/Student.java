package projekat;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.ThreadLocalRandom;

public class Student implements Runnable {
    private final int id;
    private final Direktor direktor;

    public Student(int id, Direktor direktor) {
        this.id = id;
        this.direktor = direktor;
    }

    @Override
    public void run() {
        try {
            // dolazak (0 < x <= 1 second)
            Thread.sleep(ThreadLocalRandom.current().nextInt(0, 1001));

            if (!direktor.tryAcquireStudent()) {
                // proverava studenta
                System.out.println("Greska sa studentom.");
                return;
            }

            boolean braniKodProfesora = ThreadLocalRandom.current().nextInt(2) == 0; // random 0 ili 1


            //0 - profesor   1 - asistent
            if (braniKodProfesora) {
                handleProfesorOdbranu();
            } else {
                handleAsistentOdbranu();
            }
        } catch (InterruptedException e) {
            System.out.println("Thread: Student" + id + " je prekinut.");
        } finally {
            direktor.releaseStudent(); // Release semaphore permit after defense or interruption
        }
    }

    private void handleProfesorOdbranu() throws InterruptedException {
        direktor.acquireProfessor(); // ceka profesora da zavrsi sa 2 threada

        try {
            System.out.println("Thread: Student-" + id + " čeka profesora.");
            direktor.getProfessorBarrier().await(); // Wait for another student

            long vremeOdbrane = ThreadLocalRandom.current().nextInt(500, 1001); // Simulate defense duration (0.5 <= X <= 1 second)
            Thread.sleep(vremeOdbrane);

            int score = ThreadLocalRandom.current().nextInt(6, 11); // Random score (5–10)
            direktor.addScore(score);
            direktor.incrementDefendedStudents();

            System.out.println("Thread: Student-" + id + " branio kod profesora | TTC: "
                    + vremeOdbrane + "ms | Ocjena: " + score);
        } catch (BrokenBarrierException e) {
            throw new RuntimeException(e);
        } finally {
            direktor.releaseProfessor(); // Release professor after defense is completed
        }
    }

    private void handleAsistentOdbranu() throws InterruptedException {
        direktor.acquireAssistant(); // Wait until assistant is available

        try {
            System.out.println("Thread: Student" + id + " počinje odbranu kod asistenta.");

            long vremeOdbrane = ThreadLocalRandom.current().nextInt(500, 1001); // Simulate defense duration (0.5 <= X <= 1 second)
            Thread.sleep(vremeOdbrane);

            int score = ThreadLocalRandom.current().nextInt(6, 11); // Random score (5–10)
            direktor.addScore(score);
            direktor.incrementDefendedStudents();

            System.out.println("Thread: Student" + id + " branio kod asistenta | TTC: "
                    + vremeOdbrane + "ms | Ocena: " + score);
        } finally {
            direktor.releaseAssistant(); // Release assistant after defense is completed
        }
    }
}
