        // Memastikan seluruh kode HTML sudah selesai dimuat oleh browser sebelum menjalankan skrip JavaScript di dalamnya, untuk mencegah error "elemen tidak ditemukan".
        document.addEventListener('DOMContentLoaded', function() {
            
            // Mendeklarasikan variabel konstan (tetap) untuk mengambil elemen HTML (layar, gambar, tombol) agar bisa dimanipulasi/diubah oleh JavaScript.
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('button'); // Selector diganti ke 'button' umum

            // Menyimpan link (URL) gambar untuk berbagai kondisi status (Normal, Sukses, Error) ke dalam variabel agar mudah dipanggil nanti.
            const imgNormal = 'https://placehold.co/400x80/2e1065/e9d5ff?text=Calculator+Ready';
            const imgSuccess = 'https://placehold.co/400x80/064e3b/a7f3d0?text=Calculation+Success';
            const imgError = 'https://placehold.co/400x80/7f1d1d/fecaca?text=Error+Syntax';

            // Fungsi logika untuk mengganti sumber gambar (src) pada elemen HTML berdasarkan parameter status yang diterima ('success', 'error', atau default).
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                } else if (state === 'error') {
                    statusImage.src = imgError;
                } else {
                    // Jika status tidak 'success' atau 'error', kembalikan gambar ke tampilan awal (normal).
                    statusImage.src = imgNormal;
                }
            }

            // Fungsi Clear Fungsi untuk membersihkan layar kalkulator (mengosongkan text) dan mengembalikan gambar status ke posisi normal.
            function clearDisplay() {
                display.value = '';
                changeImage('normal');
            }

            // Fungsi Hapus 1 Karakter Fungsi untuk menghapus hanya satu karakter terakhir yang diketik (seperti tombol Backspace).
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            // Fungsi Tambah Angka ke Layar ntuk menambahkan angka atau simbol yang diklik user ke layar tampilan, menyambungnya di belakang teks yang sudah ada.
            function appendToDisplay(value) {
                display.value += value;
            }

            // Fungsi Hitung Hasil Fungsi inti perhitungan. Memproses string matematika yang ada di layar dan mengubahnya menjadi hasil angka.
            function calculateResult() {
                // Pengecekan keamanan: Jika tombol sama dengan (=) ditekan saat layar kosong, munculkan pesan error.
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Empty!';
                    // Mengatur timer otomatis. Setelah 1.5 detik (1500 ms), fungsi clearDisplay akan dijalankan otomatis untuk menghapus pesan error/hasil.
                    setTimeout(clearDisplay, 1000);
                    return;
                }

                try {
                    // Menggunakan fungsi eval() untuk menghitung matematika string. Bagian .replace mengubah tanda % menjadi /100 agar bisa dihitung sistem.
                    let result = eval(display.value.replace(/%/g, '/100')); 
                    
                    // Memastikan hasil hitungan adalah angka yang valid (bukan tak terhingga atau error matematika lain).
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); 
                    // Jika perhitungan berhasil, panggil fungsi ganti gambar menjadi gambar "Sukses".
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    // ika terjadi kesalahan kode (catch error), ganti gambar menjadi gambar "Error".
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error');
                    setTimeout(clearDisplay, 1000);
                }
            }

            // Melakukan perulangan (loop) untuk memberikan perintah "klik" ke setiap tombol kalkulator yang ada di halaman.
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                    // Struktur kontrol untuk menentukan tindakan berbeda berdasarkan tombol apa yang ditekan (apakah C, DEL, =, atau angka biasa).
                    switch(value) {
                        case 'C':
                            // Jika tombol C ditekan, panggil fungsi pembersih layar.
                            clearDisplay();
                            break;
                        case 'DEL':
                            // Jika tombol DEL ditekan, panggil fungsi hapus satu karakter.
                            deleteLastChar(); 
                            break;
                        case '=':
                            // Jika tombol = ditekan, panggil fungsi hitung hasil.
                            calculateResult(); 
                            break;
                        default:
                            // Jika tombol lain (angka/operator) ditekan, tampilkan karakter tersebut ke layar.
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            // Menambahkan fitur input keyboard, agar user bisa mengetik angka atau menekan Enter/Backspace di keyboard laptop tanpa harus klik mouse.
            document.addEventListener('keydown', (e) => {
                const key = e.key;
                if ((key >= '0' && key <= '9') || ['.','+','-','*','/','%'].includes(key)) {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                }
            });
        });
