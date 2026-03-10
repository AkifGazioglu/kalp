# Kalp Animasyonu Projesi

HTML5 Canvas ve JavaScript ile oluşturulmuş, görsel olarak etkileyici ve etkileşimli bir premium kalp animasyonu. Bu proje, parçacık sistemi ve karmaşık matematiksel dalga fonksiyonları ile oluşturulan dinamik bir "nabız" etkisine sahiptir.

## 🚀 Özellikler

- **Dinamik Nabız**: Üst üste binen 6 farklı sinüs dalgası (Perlin benzeri gürültü) kullanılarak oluşturulan, kendini tekrar etmeyen doğal bir kalp atışı efekti.
- **Parçacık Sistemi**: Kalp şekli içinde akan ve etkileşime giren yüzlerce dinamik parçacık.
- **Duyarlı Tasarım**: Farklı ekran boyutlarına ve cihaz türlerine (mobil/masaüstü) otomatik olarak uyum sağlar.
- **Premium Estetik**: Derin kırmızılar, bordo tonları ve zarif beyaz/krem vurgu parçacıklarından oluşan özenle seçilmiş renk paleti.
- **Cam Morfizmi ve Yumuşak Geçişler**: İz bırakma efektleri için alfa karıştırma (alpha-blending) ve gelişmiş bir görsel derinlik kullanımı.

## 🛠️ Teknoloji Yığını

- **HTML5**: Semantik yapı ve Canvas öğesi.
- **Vanilla CSS**: Tam sayfa sürükleyici deneyim için minimal ve verimli stil yönetimi.
- **Modern JavaScript**: Özel animasyon döngüsü, parçacık fiziği ve matematiksel modelleme.

## 📁 Dosya Yapısı

- `index.html`: Canvas konteynerini içeren ana giriş noktası.
- `style.css`: Tam ekran düzeni ve arka plan estetiğini uygular.
- `script.js`: Animasyon mantığını, parçacık sistemlerini ve dalga fiziğini içeren projenin kalbi.

## 📖 Nasıl Kullanılır

1. Depoyu kopyalayın veya indirin.
2. `index.html` dosyasını herhangi bir modern web tarayıcısında açın.
3. Büyüleyici kalp atışı animasyonunun keyfini çıkarın!

## 🧪 Matematiksel Detaylar

Kalp şekli aşağıdaki parametrik denklemler kullanılarak oluşturulmuştur:
- $x = \sin^3(t)$
- $y = -(15\cos(t) - 5\cos(2t) - 2\cos(3t) - \cos(4t))$
