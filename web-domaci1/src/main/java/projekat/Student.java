package projekat;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.ThreadLocalRandom;

public class Student implements Runnable {
    private final int id;
    private final Direktor direktor;
    static int zbirOcena = 0;
    static int brOcenjenih = 0;

    public Student(int id, Direktor direktor) {
        this.id = id;
        this.direktor = direktor;
    }

    @Override
    public void run() {
        try {
            // dolazak (0 < x <= 1)
            Thread.sleep(ThreadLocalRandom.current().nextInt(0, 1001));

            long vremeDolaska  = System.currentTimeMillis() - direktor.getStartTime(); // vreme dolaska od pocetka odbrani 0<=X<=1

            if (!direktor.tryAcquireStudent()) {
                // proverava studenta
                System.out.println("Greska sa studentom.");
                return;
            }

            boolean braniKodProfesora = ThreadLocalRandom.current().nextInt(2) == 0; // random 0 ili 1


            //0 - profesor   1 - asistent
            if (braniKodProfesora) {
                handleProfesorOdbranu(vremeDolaska);
            } else {
                handleAsistentOdbranu(vremeDolaska);
            }
        } catch (InterruptedException e) {
            System.out.println("Student " + id + " je prekinut.");
        } finally {
            direktor.releaseStudent(); // release kad zavrsi
        }
    }

    private void handleProfesorOdbranu(long vremeDolaska) throws InterruptedException {
        direktor.acquireProfessor(); // ceka profesora da zavrsi sa 2 threada
        //mozda moze i tryAcquireProfessor

        try {
            System.out.println("Student " + id + " ceka profesora.");
            direktor.getProfessorBarrier().await(); // ceka drugog

            long vremePocetka = System.currentTimeMillis() - direktor.getStartTime(); // relativno vreme pocetka 5s
            long trajanjeOdbrane = ThreadLocalRandom.current().nextInt(500, 1001); // random vreme odbrane (0.5 <= X <= 1)
            Thread.sleep(trajanjeOdbrane);

            int ocena = ThreadLocalRandom.current().nextInt(5, 11); // random ocena

            synchronized (Student.class){
                zbirOcena += ocena;
                brOcenjenih++;
            }

            System.out.println("Thread: Student " + id +
                    "   Arrival: " + vremeDolaska +
                    "ms   Prof: Profesor" +
                    "   TTC: " + trajanjeOdbrane + "ms : " + vremePocetka +
                    "ms   Score: " + ocena);
        } catch (BrokenBarrierException e) {
            throw new RuntimeException(e);
        } finally {
            direktor.releaseProfessor();
        }
    }

    private void handleAsistentOdbranu(long vremeDolaska) throws InterruptedException {
        direktor.acquireAssistant(); // ceka asistenta

        try {
            System.out.println("Student " + id + " pocinje odbranu kod asistenta.");

            long vremePocetka = System.currentTimeMillis() - direktor.getStartTime();
            long trajanjeOdbrane = ThreadLocalRandom.current().nextInt(500, 1001);
            Thread.sleep(trajanjeOdbrane);

            int ocena = ThreadLocalRandom.current().nextInt(6, 11);

            synchronized (Student.class){
                zbirOcena += ocena;
                brOcenjenih++;
            }

            System.out.println("Thread: Student " + id +
                    "   Arrival: " + vremeDolaska +
                    "ms   Prof: Asistent" +
                    "   TTC: " + trajanjeOdbrane + "ms : " + vremePocetka +
                    "ms   Score: " + ocena);
        } finally {
            direktor.releaseAssistant();
        }
    }
}
