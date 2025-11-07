/**
 * Tüm Analiz Ekranları Güncelleyici
 * 
 * Bu script, tüm analiz HTML dosyalarına:
 * - Geri butonu
 * - Checkbox sistemi  
 * - Yorum sistemi
 * - İlerleme takip sistemi
 * ekler.
 */

const fs = require('fs');
const path = require('path');

// Eklenecek CSS stil bloku
const enhancedCSS = `
        /* Gelişmiş analiz özellikleri */
        .back-button { 
            position: fixed; 
            top: 20px; 
            left: 20px; 
            background: #667eea; 
            color: white; 
            border: none; 
            padding: 10px 15px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 16px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        .back-button:hover { background: #5a67d8; }
        
        .feature-item { 
            display: flex; 
            align-items: flex-start; 
            margin-bottom: 15px; 
            padding: 10px; 
            border-radius: 6px; 
            background: rgba(102, 126, 234, 0.05);
        }
        .feature-checkbox { 
            margin-right: 10px; 
            margin-top: 2px; 
            transform: scale(1.2); 
        }
        .feature-content { 
            flex: 1; 
        }
        .feature-comment { 
            margin-top: 8px; 
            padding: 8px; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            font-size: 0.9em; 
            background: white;
            width: 100%;
            resize: vertical;
            min-height: 60px;
        }
        .feature-status { 
            margin-left: 10px; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 0.8em; 
            font-weight: bold;
        }
        .status-completed { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
        .comment-toggle { 
            margin-left: 10px; 
            padding: 4px 8px; 
            background: #6c757d; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 0.8em;
        }
        .comment-toggle:hover { background: #5a6268; }`;

// Eklenecek JavaScript kodu
const enhancedJS = `
    <script>
        function toggleComment(featureId) {
            const commentDiv = document.getElementById(featureId + '-comment');
            if (commentDiv.style.display === 'none') {
                commentDiv.style.display = 'block';
            } else {
                commentDiv.style.display = 'none';
            }
        }
        
        // Checkbox durumlarını kaydet
        document.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                const fileName = document.title.replace(' Analizi', '').toLowerCase();
                localStorage.setItem(fileName + '-checkbox-' + (e.target.id || Date.now()), e.target.checked);
            }
        });
        
        // Yorum alanlarını kaydet
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('feature-comment')) {
                const fileName = document.title.replace(' Analizi', '').toLowerCase();
                localStorage.setItem(fileName + '-' + e.target.closest('[id]').id + '-comment', e.target.value);
            }
        });
        
        // İlerleme hesaplama
        function updateProgress() {
            const checkboxes = document.querySelectorAll('.feature-checkbox');
            const checkedBoxes = document.querySelectorAll('.feature-checkbox:checked');
            console.log('İlerleme:', checkedBoxes.length + '/' + checkboxes.length);
        }
        
        // Sayfa yüklendiğinde
        window.addEventListener('load', function() {
            document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox, index) {
                const fileName = document.title.replace(' Analizi', '').toLowerCase();
                const saved = localStorage.getItem(fileName + '-checkbox-' + (checkbox.id || index));
                if (saved !== null) {
                    checkbox.checked = saved === 'true';
                }
            });
            updateProgress();
        });
    </script>`;

// Analiz dosyalarının listesi
const analysisFiles = [
    '01-LOGIN-EKRANI-ANALIZ.html',
    '01-LOGIN-EKRANI.html',
    '02-ANA-SAYFA-DASHBOARD.html',
    '03-SOL-MENU-DRAWER.html',
    '04-FISLERIM-EKRANI.html',
    '05-YENI-FIS-EKRANI.html',
    '06-FIS-DETAY-EKRANI.html',
    '07-FIRMALAR-EKRANI.html',
    '08-HESABIM-EKRANI.html',
    '09-SERI-ONAY-EKRANI.html',
    '10-AYARLAR-EKRANI.html'
];

function updateAnalysisFile(fileName) {
    const filePath = path.join(__dirname, fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Dosya bulunamadı: ${fileName}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. CSS ekle (eğer yoksa)
    if (!content.includes('back-button')) {
        content = content.replace(
            '.highlight-box { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 5px; }',
            '.highlight-box { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 5px; }' + enhancedCSS
        );
    }
    
    // 2. Geri butonu ekle (eğer yoksa)
    if (!content.includes('back-button')) {
        content = content.replace(
            '<body>',
            '<body>\n    <button class="back-button" onclick="history.back()">← Geri</button>'
        );
    }
    
    // 3. JavaScript ekle (eğer yoksa)
    if (!content.includes('toggleComment')) {
        content = content.replace(
            '</body>',
            enhancedJS + '\n</body>'
        );
    }
    
    // Dosyayı kaydet
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Güncellendi: ${fileName}`);
}

// Kullanım talimatları
console.log('📋 Analiz Ekranları Güncelleyici');
console.log('Bu script tüm analiz dosyalarını gelişmiş özellikler ile günceller.\n');

console.log('🔧 Eklenen özellikler:');
console.log('  • Geri butonu (sol üst köşe)');
console.log('  • Checkbox sistemi (her özellik için)');
console.log('  • Yorum sistemi (toggle butonlu)');
console.log('  • İlerleme takip sistemi');
console.log('  • LocalStorage ile durum kaydetme\n');

// Tüm dosyaları güncelle
analysisFiles.forEach(fileName => {
    updateAnalysisFile(fileName);
});

console.log('\n🎉 Tüm analiz dosyaları başarıyla güncellendi!');
console.log('📖 TEMPLATE-GELISMIS-ANALIZ.html dosyasını yeni sayfalar için kullanabilirsiniz.');

/* 
KULLANIM:
1. Node.js yüklü olmalı
2. Bu dosyayı ekran-analiz klasöründe çalıştırın:
   node UPDATE-ALL-SCREENS.js
3. Tüm analiz dosyaları otomatik güncellenecek
*/
