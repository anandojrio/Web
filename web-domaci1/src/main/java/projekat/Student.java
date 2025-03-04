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
            // dolazak (0 < x <= 1)
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
            System.out.println("Student " + id + " je prekinut.");
        } finally {
            direktor.releaseStudent(); // release kad zavrsi
        }
    }

    private void handleProfesorOdbranu() throws InterruptedException {
        direktor.acquireProfessor(); // ceka profesora da zavrsi sa 2 threada
        //mozda moze i tryAcquireProfessor

        try {
            System.out.println("Student " + id + " ceka profesora.");
            direktor.getProfessorBarrier().await(); // ceka drugog

            long vremeOdbrane = ThreadLocalRandom.current().nextInt(500, 1001); // random vreme odbrane (0.5 <= X <= 1)
            Thread.sleep(vremeOdbrane);

            int score = ThreadLocalRandom.current().nextInt(6, 11); // random ocena
            direktor.addScore(score);
            direktor.incrementDefendedStudents();

            System.out.println("Student " + id + " branio kod profesora | TTC: "
                    + vremeOdbrane + "ms | Ocena: " + score);
        } catch (BrokenBarrierException e) {
            throw new RuntimeException(e);
        } finally {
            direktor.releaseProfessor();
        }
    }

    private void handleAsistentOdbranu() throws InterruptedException {
        direktor.acquireAssistant(); // ceka asistenta

        try {
            System.out.println("Student " + id + " pocinje odbranu kod asistenta.");

            long vremeOdbrane = ThreadLocalRandom.current().nextInt(500, 1001);
            Thread.sleep(vremeOdbrane);

            int score = ThreadLocalRandom.current().nextInt(6, 11);
            direktor.addScore(score);
            direktor.incrementDefendedStudents();

            System.out.println("Student " + id + " branio kod asistenta | TTC: "
                    + vremeOdbrane + "ms | Ocena: " + score);
        } finally {
            direktor.releaseAssistant();
        }
    }
}
