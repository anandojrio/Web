package projekat;

import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.*;

public class Direktor {
    private final int brStudenata;
    private final ExecutorService threadPool;
    private final CyclicBarrier professorBarrier;
    private final Semaphore professorSemaphore;
    private final Semaphore assistantSemaphore;
    private final Semaphore studentSemaphore;
    private final AtomicInteger zbirOcena;
    private final AtomicInteger brOcenjenihStudenata;
    private final ScheduledExecutorService timer;

    public Direktor(int brStudenata) {
        this.brStudenata = brStudenata;
        this.threadPool = Executors.newCachedThreadPool();
        this.professorBarrier = new CyclicBarrier(2); // profesor ceka dva threada
        this.professorSemaphore = new Semaphore(2,true); // dodao sam ovo posto se nisam snasao sa time da prvo zavrse odbranu
                                                           // pa onda da dodju na cekanje
        this.assistantSemaphore = new Semaphore(1,true); // samo 1, po pravom redosledu
        this.studentSemaphore = new Semaphore(brStudenata); // nema ponavljanja
        this.zbirOcena = new AtomicInteger(0);
        this.brOcenjenihStudenata = new AtomicInteger(0);
        this.timer = Executors.newSingleThreadScheduledExecutor();
    }

    public void zapocniOdbrane() {
        // 5 sekundi traje
        timer.schedule(() -> {
            threadPool.shutdownNow(); // zaustavlja sve nezavrsene threadove
            stampa();
        }, 5, TimeUnit.SECONDS);

        // ubacuje nove threadove u pool
        for (int i = 0; i < brStudenata; i++) {
            threadPool.submit(new Student(i, this));
        }

        threadPool.shutdown();
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

    public void saberiOcenu(int score) {
        zbirOcena.addAndGet(score);
    }

    public void dodajStudentaNaUkupanBroj() {
        brOcenjenihStudenata.incrementAndGet();
    }

    public CyclicBarrier getProfessorBarrier() {
        return professorBarrier;
    }

    private void stampa() {
        double prosek = (double) zbirOcena.get() / brOcenjenihStudenata.get();
        System.out.println("Ukupan broj ocenjenih studenata: " + brOcenjenihStudenata.get());
        System.out.println("Prosečna ocena: " + prosek);
    }
}
