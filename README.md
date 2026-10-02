# 👵 Anneannemin Elinden - Sesli Tarif Defteri 🍲

> *"Ben iyi bir yemek yapamam; ama benim için karmaşık bir algoritmayı tasarlamak veya bir diferansiyel denklemi çözmek ne kadar doğalsa, anneannem için de o muhteşem lezzetleri ortaya çıkarmak o kadar doğal. Ancak yazı yazma pratiği olmadığı için o eşsiz tariflerini deftere aktarmakta zorlanıyordu. Bu proje; anneannemin kendi sesini onun kılavuzuna dönüştürmek, İsmet dedemin kontrolüyle el yazısını doğrulamak ve bu kıymetli mirası ailemizin hafızasına kazandırmak için sevgiyle geliştirildi."*

---

Bu uygulama, **tamamen anneannem ve İsmet dedem için özel olarak tasarlanmıştır.** Projedeki adımlar, ekranlar, butonlar ve isimlendirmeler (*"İsmet Dede Kontrol Ekranı"*, *"Anneanne Elinden"*) onların kullanım alışkanlıklarına ve konforuna göre şekillendirilmiştir.

---

## 🌟 Neden ve Nasıl Özel Tasarlandı? (Accessibility-First)

1. **Gözü Yormayan Devasa Punto ve Büyük Harfler:**
   - Anneannemin rahatça okuyabilmesi için tüm metinler devasa puntolarla ve Türkçe karakterlere tam uyumlu (`İ`, `I`, `Ş`, `Ç`, `Ğ`, `Ö`, `Ü`) olarak **BÜYÜK HARFLE** ekrana gelir.
   - Yaşlı gözleri zorlayan soluk gri yazılar yerine yüksek kontrastlı, okunaklı renkler tercih edilmiştir.
2. **Kafa Karıştırmayan Sade Arayüz:**
   - Ekranda küçük menüler, ayarlar veya gereksiz butonlar yoktur.
   - Anneannem sadece mikrofona dokunur, söyler, ekrandaki büyük harflere bakarak kendi defterine yazar ve kocaman yeşil **"DEFTERİME YAZDIM ✍️"** butonuna basar.
3. **İsmet Dede Kontrol Ekranı 👓:**
   - Tarif tamamlandığında devreye İsmet dedem girer. Anneannemin deftere yazdığı el yazısıyla ekrandaki listeyi tek tek karşılaştırır; eksik veya yanlış varsa düzeltip onaylar.
   - Onaylandığında ekranda neşeli konfetiler patlar ve tarif güvenle kaydedilir.
4. **Tek Tuşla WhatsApp ile Aileye Paylaşım 📲:**
   - İsmet dedem onayladığı an, tarif tek tuşla torunlara veya aile WhatsApp grubuna şık ve düzenli bir mesaj olarak gönderilebilir.
5. **İnternetsiz Mutfakta Çalışma (Offline-First):**
   - Tarifler telefonun kendi hafızasında saklanır; internet olmasa bile mutfakta kesintisiz çalışır. İsteğe bağlı olarak buluta (Supabase) otomatik yedeklenir.

---

## 🏗️ Temiz Mimari (Clean Architecture)

Proje, hem hızlı hem de bakımı kolay olacak şekilde modüler bir katman mimarisiyle geliştirilmiştir:

```text
src/
├── types/recipe.ts              # Tarif, adım ve ekran tipleri
├── utils/turkishUpper.ts        # Türkçe yerel büyük harf dönüştürücü
├── services/
│   ├── storageService.ts        # Çevrimdışı öncelikli veri yönetim katmanı
│   ├── supabaseService.ts       # Bulut veritabanı senkronizasyonu
│   ├── whatsappService.ts       # Güvenli WhatsApp formatlama ve paylaşım servisi
│   └── audioFeedback.ts         # Tarayıcı içi yumuşak sesli geri bildirimler
├── hooks/
│   ├── useSpeechRecognition.ts  # Türkçe konuşmayı metne döken React kancası
│   └── usePWAInstall.ts         # Telefona uygulama simgesi ekleme kancası
└── components/
    ├── common/ (BigButton, Header, WhatsAppShareModal)
    ├── home/HomeScreen.tsx
    ├── recipe-creation/ (StepDishTitle, StepIngredientsAndSteps, StepGrandpaReview)
    └── recipe-book/ (RecipeBook, RecipeDetailModal)
```

---

## 🚀 Yayınlama & Canlıya Alma (Vercel & PWA)

Bu proje, Google Play Store süreçleriyle vakit kaybetmeden doğrudan dedem ve anneannemin telefonuna kurulabilmesi için **PWA (Progressive Web App)** olarak yapılandırılmış ve **Vercel** üzerinde barındırılmak üzere optimize edilmiştir.

### Telefona Uygulama Olarak Yükleme:
1. Vercel üzerinden oluşturulan canlı bağlantı (`https://...`) anneannemin ve dedemin telefonuna WhatsApp'tan iletilir.
2. Link Chrome tarayıcısında açıldığında ekranda beliren **"Uygulamayı Telefona Yükle"** butonuna (veya tarayıcı menüsünden *"Ana Ekrana Ekle"* seçeneğine) dokunulur.
3. Telefonun ana ekranına tıpkı bir mobil uygulama gibi **"Anneanne Defteri"** simgesi eklenir; adres çubuğu olmadan tam ekran olarak çalışır.

---

❤️ *Anneannemin el emeği, İsmet dedemin göz nuruyla...*
