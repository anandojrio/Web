package projekat;

import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.*;

import static projekat.Student.brOcenjenih;
import static projekat.Student.zbirOcena;


public class Direktor {
    private final int brStudenata;
    private final ExecutorService threadPool;
    private final CyclicBarrier professorBarrier;
    private final Semaphore professorSemaphore;
    private final Semaphore assistantSemaphore;
    private final Semaphore studentSemaphore;
    private final ScheduledExecutorService timer;
    private long startTime;

    public Direktor(int brStudenata) {
        this.brStudenata = brStudenata;
        this.threadPool = Executors.newCachedThreadPool();
        this.professorBarrier = new CyclicBarrier(2); // profesor ceka dva threada
        this.professorSemaphore = new Semaphore(2,true); // dodao sam ovo posto se nisam snasao sa time da prvo zavrse odbranu
                                                           // pa onda da dodju na cekanje
        this.assistantSemaphore = new Semaphore(1,true); // samo 1, po pravom redosledu
        this.studentSemaphore = new Semaphore(brStudenata); // nema ponavljanja
        this.timer = Executors.newSingleThreadScheduledExecutor();
    }

    public void zapocniOdbrane() {

        startTime = System.currentTimeMillis();
        // 5 sekundi traje
        timer.schedule(() -> {
            threadPool.shutdownNow(); // zaustavlja sve nezavrsene threadove
            stampa(zbirOcena,brOcenjenih);
        }, 5, TimeUnit.SECONDS);

        // ubacuje nove threadove u pool
        for (int i = 0; i < brStudenata; i++) {
            threadPool.submit(new Student(i, this));
        }

        threadPool.shutdown();
    }


    public long getStartTime() {
        return startTime; 
    }
    public boolean tryAcquireStudent() {
        return studentSemaphore.tryAcquire(); // true ako moze
    }

    public void releaseStudent() {
        studentSemaphore.release();
    }

    public void acquireProfessor() throws InterruptedException {
        professorSemaphore.acquire(); // ceka permit
    }

    public void releaseProfessor() {
        professorSemaphore.release(); // pusta permit
    }

    public void acquireAssistant() throws InterruptedException {
        assistantSemaphore.acquire();
    }

    public void releaseAssistant() {
        assistantSemaphore.release();
    }

    public CyclicBarrier getProfessorBarrier() {
        return professorBarrier;
    }

    private void stampa(int zbirOcena, int brOcenjenih) {
        double prosek = (double) zbirOcena / brOcenjenih;
        System.out.println("Ukupan broj ocenjenih studenata: " + brOcenjenih);
        System.out.println("Prosečna ocena: " + prosek);
    }
}
