# تاج الأصحاء: تحليل الموقع الحالي وخطة بناء موقع يحوّل الزوار إلى حجوزات

> إعداد: سبتمبر 2026 · يرافق هذا التقرير النسخة الجديدة من الموقع في مجلد `tajalasehaa/`.
> كل معلومة واقعية مرفقة بمصدرها، وما لم نتمكن من التحقق منه معلَّم بـ **[غير مؤكد]**.

---

## الملخص التنفيذي

1. **من هو المركز فعلًا؟** الموقع `tajalasehaa.sa` يعود إلى **«تاج الأصحاء» (Taj Al-Asehaa)** في **المدينة المنورة**، الفرع السعودي لمجموعة **Healife (هي لايف) الماليزية**. يقدّم علاجًا طبيعيًا وتأهيلًا، إلى جانب خدمات تكميلية (حجامة، تصريف لمفاوي، تغذية، نحت جسم). يملك جهازًا نادرًا هو **AlterG المضاد للجاذبية**، ويعلن أنه الأول من نوعه في المدينة.
2. **أكبر فجوات الموقع الحالي:**
   - هوية مشتّتة بين «تأهيل طبي» و«طب تكميلي وتنحيف».
   - حضور ضعيف في محركات البحث: 5 صفحات مفهرسة فقط، بعضها بعناوين مكررة، ونطاق مكرر `tajalasehaa.site`.
   - غياب إشارات الثقة الأساسية: الترخيص، والأخصائيون المصنّفون، وتقييمات Google.
   - لا دليل على صفحات هبوط مخصصة للحملات أو على تتبع حقيقي للـ Leads.
3. **الفكرة الكبرى للنسخة الجديدة:** اسم المركز مأخوذ من المثل **«الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى»**، فبنينا الهوية حوله: **«الصحة تاج… نستعيده معًا»**. في الواجهة عمود فقري ثلاثي الأبعاد ينتقل من الألم إلى التوازن، ثم يتشكّل فوقه **تاج من نور**.
4. **ما يجعله مختلفًا عن المنافسين:**
   - **مجسّم «أين يؤلمك؟»** ثلاثي الأبعاد يبدأ من الجسم لا من قائمة الخدمات.
   - **«مختبر تقنيات»** يعرض الأجهزة الحقيقية للمركز بصدق علمي، كأدوات داخل خطة وليست «علاجًا سحريًا».
   - رسائل مرتبطة بحياة الزائر في المدينة: الصلاة، والمشي إلى المسجد النبوي، وبرنامج المعتمرين.
5. **آلة تحويل كاملة:**
   - 7 صفحات هبوط للحملات، ونموذج حجز من خطوات.
   - حفظ مصدر كل طلب (UTM ومعرّفات النقر).
   - بكسلات Meta وSnap وTikTok وGoogle، مع Conversions API ومنع الاحتساب المزدوج.
   - بديل واتساب تلقائي حتى لا يضيع أي طلب.
   - صفحة هبوط تظهر خلال **~2 ثانية** على جوال بشبكة بطيئة.
6. **الامتثال أولًا:** الإعلان الصحي في المملكة منظَّم بصرامة، وتصل العقوبات إلى 10 ملايين ريال. لذلك:
   - صغنا المحتوى بلا وعود بالشفاء.
   - عطّلنا شهادات المرضى افتراضيًا.
   - طبّقنا الموافقة الصريحة وفق نظام حماية البيانات الشخصية.
   - لا نرسل أي بيانات صحية للمنصات الإعلانية.

---

## 1. تحليل النسخة الحالية (tajalasehaa.sa)

### 1.1 المنهجية وحدودها

لم يكن الوصول المباشر إلى `tajalasehaa.sa` متاحًا من بيئة العمل، إذ حجبت سياسة الشبكة النطاق وأرشيف الإنترنت. لذلك اعتمد التحليل على نتائج محركات البحث ومقتطفاتها للصفحات المفهرسة، وعلى مصادر خارجية: إعلانات توظيف، وصفحات Healife، ومقالات صحفية. للحصول على تدقيق تقني كامل (السرعة، النماذج، البكسلات المثبتة، الصور) يلزم أحد أمرين:

- السماح بالنطاق في إعدادات الشبكة للبيئة.
- أو تزويدنا بلقطات شاشة للصفحات أو صلاحية على Google Search Console.

### 1.2 ما وجدناه

| البند | ما وُجد | المصدر |
|---|---|---|
| الاسم | «تاج الأصحاء» · Taj Al-Asehaa (ويُكتب أيضًا Taj Alasehaa) | [tajalasehaa.sa](https://tajalasehaa.sa/)، [tajalasehaa.site/en](https://tajalasehaa.site/en/) |
| المدينة | المدينة المنورة (لم نجد فروعًا أخرى في المملكة) | [tajalasehaa.sa](https://tajalasehaa.sa/)، [صفحة العلاج المنزلي](https://tajalasehaa.sa/optional-home-physiotherapy/) |
| الشراكة | يقدّم نفسه كفرع سعودي لـ Healife الماليزية («أول فرع في السعودية قادم مباشرة من ماليزيا») | [tajalasehaa.site/en](https://tajalasehaa.site/en/)، [Healife](https://healife.com.my/who-we-are/) |
| المؤسِّسة | «الدكتورة ريهام»، ومؤسِّسة Healife في كوالالمبور تحمل الاسم نفسه (تعمل منذ 2019) | [من نحن](https://tajalasehaa.sa/about-us/)، [Malaysia Gazette](https://malaysiagazette.com/2022/03/03/healife-tawar-penyelesaian-kesihatan-moden-dan-tradisional/) |
| التموضع | «مركز علاج طبيعي وإعادة تأهيل… يجمع بين الطب الحديث والطب التكميلي بخبرة ماليزية» | [tajalasehaa.sa](https://tajalasehaa.sa/) |
| الخدمات | علاج طبيعي للعضلات والمفاصل والعمود الفقري · تأهيل بعد العمليات والإصابات الرياضية · تصريف لمفاوي (كبار وأطفال) · تغذية علاجية · **برامج تأهيل للمعتمرين** · حجامة وقائية وعلاجية · تنحيف ونحت · «تنشيط الجسم» | [tajalasehaa.sa](https://tajalasehaa.sa/)، [من نحن](https://tajalasehaa.sa/about-us/) |
| الزيارات المنزلية | متاحة، مع رعاية كبار السن | [العلاج المنزلي](https://tajalasehaa.sa/optional-home-physiotherapy/) |
| الأجهزة | **AlterG** (يخفف حتى 80% من الحمل، «الأول من نوعه في المدينة»)؛ أجهزة BTL (علاج كهربائي وموجات فوق صوتية، موجات تصادمية)؛ ITO؛ EMS | [تقنيات التأهيل](https://tajalasehaa.sa/advanced-rehab-tech/)، [التقنيات](https://tajalasehaa.sa/techniques-technologies/) |
| أوقات العمل | الإثنين–السبت 10:00–19:00، والأحد مغلق **[يبدو منسوخًا من فرع ماليزيا]** | [tajalasehaa.site/en](https://tajalasehaa.site/en/) |
| الهاتف | 0573998384 (ظاهر في نتائج الموقع وإعلان توظيف) | [Telegram jobs](https://t.me/s/Jobs_Almadina?before=11774) |
| العروض | عروض افتتاح: تقييم علاج طبيعي أو تغذية مجاني لفترة محدودة، وخصم 10–25% على أغلب الخدمات | نتائج البحث للموقع وTikTok |
| التوظيف | أخصائية صحة المرأة، وأخصائي علاج طبيعي، وفني، ومعالج تدليك طبي | [Bayt](https://www.bayt.com/en/company/taj-alasehaa-2259720/) |
| المراجعات | شهادات منشورة على موقع المركز فقط («فريق محترف»، «تعقيم على أعلى مستوى»، «أجهزة حديثة») | [tajalasehaa.site/en](https://tajalasehaa.site/en/) |

**لم نعثر على:**
- السجل التجاري، أو ترخيص وزارة الصحة، أو اعتماد CBAHI.
- العنوان الدقيق.
- تقييم Google وعدد المراجعات.
- شركات التأمين المتعاقد معها.
- أسماء الأخصائيين.
- حسابات التواصل وأرقامها.
- ألوان الهوية.
- إعلانات مسجّلة في مكتبة Meta.
- الأسعار.

### 1.3 نقاط القوة التي يجب البناء عليها

1. **جهاز AlterG «الأول في المدينة»:**
   - أصل تسويقي نادر ومرئي، ومناسب لقصص ما بعد العمليات وكبار السن والرياضيين.
   - منافسون كبار يبيعونه كباقة، مثل PhysioTherabia [مصدر](https://physiotherabia.com/shop/packages-en/physical-therapy-antigravity-treadmill-hydrotherapy-package/)، وPhysiowell تخطط لإضافته [مصدر](https://alsyahaalarabia.com/saudi-today/92971). أي أن الأسبقية المحلية قابلة للتآكل، وتستحق الاستثمار الآن.
2. **برنامج المعتمرين والزوار:**
   - زاوية فريدة للمدينة المنورة لم نجدها لدى المنافسين.
   - تخاطب جمهورًا ضخمًا يمشي مسافات طويلة: آلام القدم والركبة والظهر، وكبار السن.
3. **الشراكة الدولية مع Healife:** مصداقية «معايير دولية» تميّز المركز عن المراكز المحلية الصغيرة.
4. **الزيارات المنزلية وأخصائيات صحة المرأة:** من أقوى محفزات الحجز في السوق السعودي.

### 1.4 الفجوات والفرص

| الفجوة في النسخة الحالية | أثرها | ما فعلناه في النسخة الجديدة |
|---|---|---|
| هوية تخلط التأهيل الطبي بالتنحيف والحجامة و«الطب الصيني والهندي» | تُضعف صورة «مركز تأهيل طبي محترف» وتثير أسئلة المصداقية | التأهيل الطبي هو الواجهة والمسار الأساسي، والخدمات التكميلية في تبويب منفصل «الرعاية التكميلية» |
| 5 صفحات مفهرسة فقط، وعناوين مكررة (الرئيسية و«من نحن» بالعنوان نفسه)، ونطاق مكرر `.site`، وصفحة إنجليزية بعنوان عربي | ظهور ضعيف في «علاج طبيعي المدينة المنورة» ومحتوى مكرر يشتّت الترتيب | عنوان ووصف فريدان لكل صفحة، و7 صفحات حالات مفهرسة، وSchema `MedicalClinic`، وsitemap، وcanonical، **وتوصية بتحويل 301 للنطاق المكرر** |
| ادعاءات مثل «تقنية NASA» و«أفضل مركز» و«+10 سنوات» (بينما Healife منذ 2019) | خطر نظامي في الإعلان الصحي، ويمكن للمنافس الطعن فيها | صياغة وصفية بلا تفضيل مطلق، والادعاءات القابلة للتحقق معلَّمة للاعتماد في `site.ts` |
| لا ترخيص ظاهر، ولا أسماء أو تصنيفات للأخصائيين | فقدان الثقة، خاصة لزوار الإعلانات الذين لا يعرفون المركز | أماكن جاهزة لرقم الترخيص وبطاقات الفريق، والفحص قبل النشر ينبّه لغيابها |
| أوقات عمل غير منطقية للسوق السعودي (مغلق الأحد) | اتصالات لا يُرد عليها، وزيارات لأبواب مغلقة، وخسارة مباشرة لطلبات الحملات | معلَّمة «تحقق»، وتظهر في كل مكان من مصدر واحد |
| لا دليل على صفحات هبوط أو تتبع للحملات | لا يُعرف أي إعلان يجلب حجوزات فعلية | منظومة تتبع كاملة (القسم 5) |

---

## 2. السوق والمنافسون

### 2.1 أبرز المنافسين وما يفعلونه

| المنافس | ما يميز موقعه | الملاحظة |
|---|---|---|
| **PhysioTherabia** (بُرجيل + ليجام، 28+ مركزًا) | باقات تُشترى أونلاين (علاج طبيعي + AlterG + علاج مائي «من 1,050 ريال»)، و800 + واتساب + نموذج | [ADX](https://apigateway.adx.ae/adx/cdn/1.0/content/download/3284521)، [الباقة](https://physiotherabia.com/shop/packages-en/physical-therapy-antigravity-treadmill-hydrotherapy-package/) |
| **PhysioTrio** (الرياض، مكة) | «احجز في أقل من 3 دقائق»، و50+ أخصائي، و10+ شركات تأمين، و10,000+ مريض: أقوى إثبات اجتماعي محليًا | [الموقع](https://physiotrio.sa/en) |
| **Physiowell** (الرياض، ديسمبر 2025) | تموضع تقني فاخر: صحة المرأة، وتتبع الحركة، وتقييم بالذكاء الاصطناعي | [Riyadh Key](https://riyadhkey.com/physiowell-officially-launches-in-riyadh-setting-new-standard-of-rehabilitation-care-in-saudi-arabia/) |
| **Sumo PT** | صفحات لكل تخصص، وحجز بواتساب، وتسمية الأخصائيات | [الموقع](https://sumo.sa/en/) |
| **Elaji** | ليزر وموجات تصادمية، وعيادة صحة المرأة | [الصفحة](https://elajicenter.com/) |
| **ERADAH / Almoosa** | اعتماد CARF الدولي ظاهر | [CARF](https://carf.org/provider/eradah-rehabilitation-centers-374007/) |
| **First Response** (منزلي) | «نصل خلال 45 دقيقة» | [الصفحة](https://firstresponsehealthcare.com/sa/riyadh/physiotherapy-at-home) |

**نقاط الضعف المتكررة لدى المنافسين:**
- **قوالب غير مكتملة:** عنوان lorem-ipsum ظاهر في صفحة حية، وصفحة «علاج الصداع» على مسار `/treatment-of-colon`.
- **ادعاءات مبالغ فيها بلا دليل:** «البديل الأكثر فعالية عن الجراحة»، و«تحسن 95% خلال 3–5 جلسات».
- **الأجهزة قبل المريض:** قوائم أجهزة بلا شرح لمن تناسب ولا لعدد الجلسات.
- **حجز مشتت:** عدة أرقام، أو واتساب فقط.
- **غياب ما يطمئن قبل الحجز:** لا فرز للحالة، ولا مؤشر سعر، ولا تحقق من التأمين.

[مصادر الأمثلة في تقرير المنافسين، القسم 1](#المصادر)

> ملاحظة: تركّز البحث على الرياض وجدة والشرقية، ويُنصح بمسح منافسي المدينة المنورة تحديدًا (بحث Google Maps عن «علاج طبيعي المدينة المنورة» وتسجيل التقييمات والأسعار والعروض).

### 2.2 ما يفعله الرواد عالميًا (وأخذناه)

| النمط | المثال | كيف طبّقناه |
|---|---|---|
| البدء من الجسم أو الحالة لا من الخدمة | مُدقّقات الأعراض حسب المنطقة | مجسّم «أين يؤلمك؟» ثلاثي الأبعاد |
| التحقق من الأهلية كزر رئيسي | Hinge Health وSword | «هل يغطي تأمينك جلساتك؟» ← واتساب جاهز |
| خطوة أولى مجانية وواضحة | فحص مجاني 15 دقيقة (ATI، Pure Sports) | عرض «تقييم مجاني لفترة محدودة» (قائم فعلًا لدى المركز) |
| رحلة علاج واضحة ونتائج مكتوبة | Pure Sports Medicine: «تغادر بخطة واضحة» | قسم «رحلة التعافي» وقسم «التزاماتنا» |
| نشر النتائج | Hinge (انخفاض الألم 68%)، وShirley Ryan AbilityLab (تقرير نتائج سنوي) | **توصية مستقبلية:** تقرير نتائج مجمّع سنوي بعد مراجعة نظامية |

المصادر: [Hinge](https://www.hingehealth.com/resources/clinical-studies/)، [Sword](https://sword.com/articles/thrive-digital-physical-therapy)، [SRAlab](https://www.sralab.org/sites/default/files/downloads/2025-10/Services%20Outcomes%202025%20Annual%20Report%20V3.pdf)، [ATI](https://therapy.atipt.com/complimentary-screening/)، [Pure](https://puresportsmed.com/services/physiotherapy/).

---

## 3. الفكرة الكبرى: لماذا سيكون الموقع مختلفًا؟

### 3.1 «الصحة تاج… نستعيده معًا»

اسم المركز نفسه مثل عربي شهير، وهذه فرصة لا يملكها أي منافس. حوّلناه إلى تجربة بصرية في الواجهة:

1. عمود فقري ثلاثي الأبعاد يظهر **منحرفًا وأقراصه حمراء** (الألم).
2. يستقيم تدريجيًا وتتحول الأقراص إلى **النعناعي** (التوازن).
3. تسري إشارة ضوئية عبر الحبل الشوكي.
4. يتشكّل **تاج من نور ذهبي** فوقه.

القصة كاملة في 4 ثوانٍ، وبلا كلمة واحدة. اختيرت الصياغة «نستعيده معًا» بدل «نعيده لك» عمدًا، لأنها شراكة لا وعد بالشفاء، وهذا أسلم نظاميًا.

### 3.2 عناصر التميّز في التجربة

| العنصر | لماذا يرفع التحويل |
|---|---|
| **«أين يؤلمك؟»:** مجسّم تفاعلي بـ 9 مناطق | يحوّل الزائر من «متصفح» إلى «مشارك». يرى حالته (عرق النسا، خشونة الركبة…) فيشعر أن المركز يفهمه، ثم يحجز بزر يحمل اسم منطقته. |
| **مختبر التقنيات:** الأجهزة الأربعة الحقيقية ثلاثية الأبعاد بنقاط شرح | يبني صورة «مركز حديث» دون ادعاءات. نعرض لكل جهاز: كيف يعمل، ولمن، ومدة الجلسة وعددها، والإحساس أثناءها. ونضع الأجهزة «ضمن خطة تعتمد على التمارين» كما توصي الأدلة الطبية. |
| **لحظات الحياة** | الرسالة ليست «نخفف الألم»، بل «ترجع لسجودك بخشوع، ولخطواتك إلى المسجد النبوي، ولملعب البادل، ولحمل أطفالك». هذه أهداف عاطفية ومحلية جدًا. |
| **برنامج المعتمرين والزوار** | صفحة هبوط خاصة تقبل الأرقام الدولية، وبرنامج يناسب مدة الإقامة. |
| **التزاماتنا** بدل شهادات المرضى | وعود خدمة قابلة للقياس (تقييم قبل أي جلسة، خطة مكتوبة، رد خلال 15 دقيقة) تقنع دون مخالفة قيود الإعلان الصحي على الشهادات. |

### 3.3 ملاحظات عن الأدلة العلمية للأجهزة (للفريق الطبي)

- **الموجات التصادمية:** جلسات قصيرة، وعادة 3 جلسات بفاصل أسبوعي. الأدلة متفاوتة حسب الحالة ([NHS](https://www.ouh.nhs.uk/media/35kl5xmx/117207extracorporeal-shockwave-therapy.pdf)، [NICE IPG311](https://www.nice.org.uk/guidance/ipg311)).
- **AlterG:** يخفف حتى 80% من وزن الجسم ([UPMC](https://share.upmc.com/2017/03/alterg-anti-gravity-treadmill/)). دراسة صغيرة بعد تبديل الركبة وجدته آمنًا ([MDedge](https://mdedge.com/content/use-anti-gravity-treadmill-early-postoperative-rehabilitation-after-total-knee-replacement)).
- **TENS والموجات فوق الصوتية:** توصي NICE بعدم استخدامها لآلام أسفل الظهر ([NICE NG59](https://www.nice.org.uk/guidance/ng59)) **[غير مؤكد التفاصيل]**. لذلك قدّمنا الجهاز المدمج كـ«أداة مساندة لتخفيف الألم قصير المدى ضمن خطة التمارين» لا كعلاج للظهر.
- **EMS:** مفيد لإعادة تنشيط العضلات الضعيفة (مثل عضلة الفخذ بعد الرباط الصليبي) ضمن التأهيل.

---

## 4. استراتيجية التحويل (CRO): ماذا نفّذنا ولماذا

### 4.1 السرعة أولًا

- دراسة Deloitte لـ Google: تحسين سرعة صفحات الجوال **0.1 ثانية** رفع التحويل في التجزئة **8.4%** ([web.dev](https://web.dev/case-studies/milliseconds-make-millions)).
- **ما نفّذناه:**
  - كل صفحة مولَّدة مسبقًا (HTML جاهز).
  - JavaScript الأساسي ≈ **114KB** مضغوط.
  - three.js في حزمة منفصلة لا تُحمّل إلا عند الحاجة.
  - خط عربي متغيّر واحد (23KB للحروف العربية).
- **قياسنا المحلي:**
  - صفحة `/lp/back-pain` على جوال بشبكة بطيئة (1.6Mbps، زمن 150ms، ومعالج أبطأ 4×): **LCP ≈ 2.0 ثانية** بحجم نقل **192KB**.
  - الرئيسية مع المشهد ثلاثي الأبعاد: **≈ 2.3 ثانية**.
  - الحد الجيد عند Google 2.5 ثانية.

### 4.2 سرعة الرد على الطلب (Speed-to-lead): العامل الأهم خارج الموقع

- **HBR 2011:** الشركات التي حاولت التواصل خلال ساعة كانت أكثر قدرة على تأهيل العميل بنحو **7 أضعاف** من التي انتظرت ساعة أو أكثر، وبأكثر من **60 ضعفًا** مقارنة بمن انتظر 24 ساعة ([المصدر](https://scholarsarchive.byu.edu/facpub/9711)).
- **دراسة MIT/InsideSales:** الاتصال خلال 5 دقائق بدل 30 رفع احتمال الوصول للعميل 100 ضعف ([المصدر](https://customerthink.com/are-your-lead-response-practices-costing-you-sales/)). تحفّظ: الدراسة أمريكية وتجارية وليست صحية.
- **التوصية التشغيلية:**
  - رد واتساب آلي خلال دقيقة.
  - اتصال بشري خلال 5 دقائق.
  - الموقع يعد الزائر بـ 15 دقيقة (قابلة للتعديل في `site.ts`).

### 4.3 عناصر التحويل المنفّذة

| العنصر | التفصيل |
|---|---|
| **نموذج حجز من خطوات** | يبدأ بسؤال سهل بنقرة واحدة («ما الذي تحتاج المساعدة فيه؟»)، ثم التفضيلات (لمن الحجز، في المركز أو منزلي، الوقت، أخصائي أو أخصائية، الدفع)، ثم الاسم والجوال. القيم الافتراضية مختارة مسبقًا، ويحفظ المسودة إن خرج الزائر. |
| **نسخة سريعة في صفحات الحملات** | خطوتان فقط، والحالة مختارة مسبقًا من الإعلان. |
| **«الحجز لأحد والديّ»** | خيار ثقافي مهم (برّ الوالدين) يفتح شريحة الأبناء الذين يحجزون لآبائهم. |
| **الجوال بأي صيغة** | يقبل الأرقام العربية (٠٥…) والدولية (للمعتمرين)، ويحوّلها لصيغة E.164. |
| **شريط ثابت على الجوال** | اتصال · واتساب · «احجز تقييمك المجاني». يختفي تلقائيًا عند ظهور النموذج. |
| **بديل واتساب** | إن تعذّر الإرسال، يُعرض زر واتساب برسالة جاهزة فيها كل التفاصيل ورقم الطلب. |
| **صفحة شكر مفيدة** | رقم الطلب، و«أكّد عبر واتساب»، والخطوات التالية (أحضر تقاريرك، ملابس مريحة، الموقع). |
| **تحقق من التأمين** | نموذج يرسل اسم الشركة وفئة البطاقة عبر واتساب. |

> ملاحظة: الأرقام الشائعة عن تفوق النماذج متعددة الخطوات (مثل 13.85% مقابل 4.53%) **[غير مؤكدة]**. عاملها كفرضية تُختبر (القسم 9).

---

## 5. منظومة الحملات وتتبع الـ Leads

### 5.1 المنصات في السعودية

| المنصة | الوصول | المصدر |
|---|---|---|
| الإنترنت | 34.4 مليون مستخدم (99%) نهاية 2025 | [DataReportal 2026](https://datareportal.com/reports/digital-2026-saudi-arabia) |
| Snapchat | وصول إعلاني 24.7 مليون (مطلع 2025)، ويصل لـ 9 من كل 10 بين 13–34 سنة | [DataReportal 2025](https://datareportal.com/reports/digital-2025-saudi-arabia)، [Arabian Business](https://www.arabianbusiness.com/industries/technology/snapchat-community-crosses-20-million-in-saudi-arabia-reaching-9-in-10-people-aged-13-to-34) |
| TikTok | وصول إعلاني يعادل 154% من البالغين (يشمل حسابات مكررة) | [Statista](https://statista.com/statistics/1299829/tiktok-penetration-worldwide-by-country) |
| Instagram | ~20 مليون (ديسمبر 2025) | [NapoleonCat](https://stats.napoleoncat.com/instagram-users-in-saudi_arabia/2025/12/) |
| YouTube | 27.2 مليون | [DataReportal](https://datareportal.com/reports/digital-2026-saudi-arabia) |

### 5.2 ما بنيناه تقنيًا

1. **حفظ المصدر:**
   - كل زيارة تُسجّل أول مصدر وآخر مصدر (UTM ومعرّفات النقر `fbclid`/`gclid`/`gbraid`/`wbraid`/`ttclid`/`ScCid`) لمدة 90 يومًا.
   - يُنشأ ملف `_fbc` من `fbclid` حسب مواصفة Meta.
2. **كل طلب يحمل مصدره:** الحملة، والإعلان، ومعرّف النقر، وصفحة الهبوط. تُرسل هذه البيانات إلى Google Sheet (أو CRM)، مع أعمدة للفريق: «حجز مؤكد؟ حضر؟».
3. **أحداث البكسل** (مطابقة لتوثيق كل منصة):

| الحدث | Meta | Snap | TikTok | Google |
|---|---|---|---|---|
| إرسال طلب | `Lead` | `SIGN_UP` (لا يوجد حدث LEAD في Snap) | `Lead` (كان `SubmitForm` حتى مايو 2025) | `generate_lead` + تحويل Ads |
| نقرة واتساب/اتصال | `Contact` | `CUSTOM_EVENT_1` | `Contact` | حدث مخصص |
| حجز مؤكد (من الـ CRM لاحقًا) | `Schedule` | `RESERVE` | حدث CRM | رفع تحويلات دون اتصال |

   المصادر: [Meta](https://developers.facebook.com/documentation/meta-pixel/reference)، [Snap](https://developers.snap.com/marketing-api/Conversions-API/Parameters)، [TikTok](https://ads.tiktok.com/help/article/how-to-adopt-tiktoks-updated-standard-events?lang=en)، [GA4](https://support.google.com/analytics/answer/9267735).

4. **منع الاحتساب المزدوج:**
   - معرّف واحد `event_id` لكل طلب، يُرسل من المتصفح ومن الخادم.
   - في Meta يُطابَق `eventID` مع `event_id`، وفي Snap `client_dedup_id` مع `event_id` (خلال 48 ساعة).
   - مصادر: [Meta dedup](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)، [Snap dedup](https://developers.snap.com/marketing-api/Conversions-API/Deduplication)، [TikTok dedup](https://ads.tiktok.com/help/article/event-deduplication).
5. **الخصوصية:**
   - نوع الشكوى لا يُرسل أبدًا للمنصات الإعلانية.
   - رقم الجوال المشفّر لا يُرسل إلا بموافقة تسويقية اختيارية.

### 5.3 الخطوة التالية الأهم: التحسين على «الحجوزات» لا «الطلبات»

عندما يحدّث الفريق عمود «حجز مؤكد؟ / حضر؟»، أعِد إرسال هذه النتيجة للمنصات:

| المنصة | الحدث أو الأداة |
|---|---|
| Meta | `Schedule`، وهدف «Conversion leads» |
| Snap | `RESERVE` |
| TikTok | أحداث CRM |
| Google | رفع التحويلات دون اتصال |

هكذا تتعلم الخوارزميات جلب مرضى يحضرون فعلًا. من يونيو 2026 تستقبل Google الإعدادات الجديدة لرفع التحويلات عبر **Data Manager API** ([ppc.land](https://ppc.land/google-blocks-new-offline-conversion-imports-via-ads-api-from-june-15/)).

### 5.4 خطة الحملات المقترحة

| الحملة (صفحة الهبوط) | المنصة الأنسب | الجمهور والزاوية |
|---|---|---|
| `/lp/back-pain` | Snapchat + TikTok + بحث Google | 25–55، موظفون وسائقون: «ألم الظهر له سبب…» |
| `/lp/knee` + `/lp/alterg` | Instagram/Facebook + بحث Google | 45+ وأبناؤهم، وما بعد العمليات: AlterG «امشِ بجزء من وزنك» |
| `/lp/umrah` | Snapchat (نطاق جغرافي حول المنطقة المركزية) + بحث Google | الزوار والمعتمرون: «زيارتك للمدينة… بخطوات مريحة» **[تحقق من سياسات الاستهداف الجغرافي]** |
| `/lp/women` | Instagram + Snapchat (نساء 22–45) | ما بعد الولادة وآلام الحمل، مع أخصائيات |
| `/lp/home` | بحث Google + Facebook (الأبناء 30–55) | «علاجك الطبيعي في بيتك» لكبار السن |
| `/lp/shockwave` | بحث Google + TikTok | الشوك العظمي ومرفق التنس |

**أفكار إبداعية للإعلانات:**
- سجّل مشهد العمود الفقري وهو يستقيم ويظهر التاج كفيديو عمودي 9:16، ليكون افتتاحية موحّدة للهوية على سناب وتيك توك.
- أضف فيديو حقيقيًا لجهاز AlterG أثناء الاستخدام بموافقة موثقة، ونصائح قصيرة من أخصائي (3 تمارين لأسفل الظهر).
- **Google Business Profile** إلزامي: صور حقيقية، وفئة «مركز علاج طبيعي»، وأوقات صحيحة، وطلب التقييمات من المراجعين. هو أول ما يراه الباحث عن «علاج طبيعي قريب مني».

**تسمية UTM موحّدة:** `utm_source`=المنصة · `utm_medium`=paid · `utm_campaign`=الحملة-السنة-الشهر · `utm_content`=الإعلان.

---

## 6. الامتثال: قيود يجب احترامها قبل أي إعلان

### 6.1 الإعلان الصحي (وزارة الصحة والهيئة السعودية للتخصصات الصحية)

- لا يجوز الإعلان إلا وفق اللوائح وأخلاقيات المهنة. تصل العقوبات إلى **10 ملايين ريال والسجن وإغلاق المنشأة** ([Lexis 2025](https://www.lexis.ae/2025/02/18/ksa-health-ministry-enforces-compliance/)).
- **ممنوع:**
  - الإعلانات «غير المبنية على أسس علمية».
  - ألقاب مهنية غير معتمدة.
  - ([نظام مزاولة المهن الصحية](https://www.moh.gov.sa/en/Ministry/Rules/Documents/Law-of-Practicing-Healthcare-Professions.pdf)).
- **الخصومات والعروض** تحتاج موافقة مسبقة من إدارة التراخيص بالشؤون الصحية في المنطقة ([MOH](https://www.moh.gov.sa/eServices/Licences/Documents/10.pdf)). وقائمة الأسعار تحتاج اعتمادًا **[جزئي التحقق]**.
- **الوقائع المسجلة:** إيقاف ممارس 4 أشهر بسبب إعلانات بلا أساس علمي ([MOH 2024](https://www.moh.gov.sa/en/ministry/mediacenter/news/pages/news-2024-04-21-003.aspx)).
- **صور المرضى وقبل/بعد:** ممنوعة إلا في حالات محددة ([Gulf News](https://gulfnews.com/world/gulf/saudi/five-saudi-healthcare-workers-face-severe-punishments-after-exposing-patients-body-on-social-media-1.104980497)).
- **شهادات المرضى:** قد تكون محظورة في إعلانات المنشآت ([IBA 2024](https://www.ibanet.org/document?id=Healthcare-Survey-Responses-2024-Saudi-Arabia)) **[غير مؤكد المرجعية]**. لذلك **عطّلنا قسم الشهادات افتراضيًا**.
- **المسميات المهنية:** اعرض المسمى المهني لكل أخصائي كما في تصنيف الهيئة ([ممارس بلس](https://eservices.scfhs.org.sa/en/classification-professional-from-inside-outside-kingdom-)).
- **ادعاءات الموقع الحالي تحتاج مراجعة:** «تقنية NASA»، و«الأول في المدينة»، و«+10 سنوات»، و«+5000 مراجع»، و«أفضل مركز».
- **الحجامة والطب التكميلي:** تأكد من التراخيص الخاصة بها وبممارسيها قبل الإعلان عنها **[يُراجع مع الجهة المختصة]**.

### 6.2 نظام حماية البيانات الشخصية (PDPL)

- **النفاذ:** سارٍ منذ سبتمبر 2023 (والمهلة حتى سبتمبر 2024)، والجهة المختصة سدايا ([sdaia](https://dgp.sdaia.gov.sa)) **[تفاصيل غير مؤكدة في هذه الجلسة]**.
- **البيانات الصحية** «حساسة»: اجمع الحد الأدنى فقط، مع إشعار خصوصية وموافقة صريحة (مربعات غير محددة مسبقًا).
- **الإبلاغ عن التسريب:** خلال 72 ساعة.
- **النقل خارج المملكة:** وفق اللائحة. تنبيه: Google Sheets قد يعني معالجة خارج المملكة.
- **ما نفّذناه:**
  - موافقة إلزامية غير محددة مسبقًا.
  - موافقة تسويقية اختيارية منفصلة.
  - صفحة `/privacy` كقالب يحتاج مراجعة نظامية.
  - لا بيانات صحية للمنصات الإعلانية.
  - تشفير المعرّفات.
  - تقليل الحقول إلى الضروري.

---

## 7. التجربة ثلاثية الأبعاد: مبهرة وسريعة معًا

- **نماذج إجرائية** (مبنية بالكود): الأجهزة والعمود الفقري والمجسّم مبنية بالكامل بالكود، بلا ملفات GLB ثقيلة ولا مكتبات نماذج بتراخيص معقدة. حزمة المشاهد كاملة ≈ 264KB مضغوطة، وتُحمّل فقط عند الاقتراب منها.
- **أداء:**
  - تتوقف المشاهد عند خروجها من الشاشة.
  - الدقة محدودة على الجوال، وتنخفض تلقائيًا إن ضعف الجهاز ([PerformanceMonitor](https://drei.docs.pmnd.rs/performances/performance-monitor)).
  - الظلال تُحسب لحظة التبديل ثم تُجمَّد.
  - نموذج الحجز يعمل فورًا دون انتظار تحميل الـ 3D.
- **حدود الأجهزة:** Safari على iOS يسمح بـ 16 سياق WebGL فقط ([WebKit](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/html/canvas/WebGLRenderingContextBase.cpp)). نستخدم 3 مشاهد كحد أقصى، ولا يعمل منها إلا الظاهر.
- **بدائل:** رسم SVG ثابت إن لم يتوفر WebGL2 (three.js يتطلبه منذ r163)، أو إن تعطل المشهد، أو قبل تحميله.
- **الوصول (WCAG 2.2):**
  - كل النصوص والحجز خارج الـ canvas.
  - لكل نقطة تفاعلية زر مكافئ في قائمة جانبية.
  - أزرار تدوير (لا يشترط السحب، 2.5.7).
  - زر إيقاف الحركة (2.2.2).
  - احترام «تقليل الحركة».
  - أحجام لمس ≥ 24px.
- **مستقبلًا:**
  - يمكن طلب ملفات CAD الرسمية من BTL وAlterG، أو تكليف نمذجة احترافية لنسخ مطابقة للأجهزة.
  - يمكن استخدام نماذج تشريحية مفتوحة مثل BodyParts3D أو Z-Anatomy (رخصة CC BY-SA تتطلب نسب العمل ومشاركة المشتقات).
  - أوامر التحسين:
    ```bash
    npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp --texture-size 1024
    ```

---

## 8. ما تم تنفيذه (خريطة الملفات)

| المكوّن | الملف |
|---|---|
| إعدادات المركز والعرض والبكسلات | `src/config/site.ts` |
| البرامج، واللحظات، والرحلة، والالتزامات، والأسئلة | `src/config/content.ts` |
| الأجهزة ونقاطها | `src/config/devices.ts` · النماذج في `src/three/devices/*` |
| مجسّم الألم | `src/config/body.ts` · `src/three/BodyScene.tsx` · `src/components/sections/PainMap.tsx` |
| العمود الفقري والتاج | `src/three/SpineScene.tsx` · `src/components/sections/Hero.tsx` |
| نموذج الحجز | `src/components/booking/*` |
| صفحات الحملات | `src/config/campaigns.ts` · `src/pages/Landing.tsx` |
| التتبع والمصادر | `src/lib/tracking.ts` · `src/lib/attribution.ts` |
| استقبال الطلبات وCAPI | `api/lead.ts` · `integrations/google-sheets-webhook.gs` |
| SEO والتوليد المسبق | `src/seo.ts` · `scripts/prerender.mjs` |
| فحص ما قبل النشر | `scripts/check-content.mjs` (`npm run check:content`) |

---

## 9. القياس وخطة الاختبارات

### مؤشرات الأداء الأساسية
حدّد خط الأساس في أول أسبوعين، ثم استهدف التحسين:

1. معدل التحويل (طلبات ÷ زيارات) لكل صفحة هبوط ولكل منصة.
2. تكلفة الطلب، ثم **تكلفة الحجز المؤكد**، ثم **تكلفة المريض الذي حضر** (المؤشر الحقيقي).
3. نسبة الطلب ← حجز، ونسبة الحجز ← حضور.
4. وسيط زمن الرد على الطلب (الهدف < 5 دقائق).
5. نقرات واتساب والاتصال كتحويلات مساندة.

### اختبارات A/B مقترحة (بالترتيب)
1. العرض: «تقييم مجاني» مقابل بلا عرض (بعد موافقة الجهة المختصة على العرض).
2. عنوان صفحة الهبوط: الألم («ألم الظهر له سبب») مقابل الهدف («ارجع لصلاتك بلا ألم»).
3. النموذج أولًا مقابل واتساب أولًا (على صفحات سناب شات تحديدًا).
4. قسم الجهاز ثلاثي الأبعاد في صفحة الهبوط: ظاهر أم مخفي، وقياس أثره على التحويل وزمن التحميل.
5. نسخة النموذج: خطوتان مقابل ثلاث في الصفحة الرئيسية.

---

## 10. البيانات المطلوبة من المركز

- [ ] رقم ترخيص وزارة الصحة، والسجل التجاري، وأي اعتماد (CBAHI).
- [ ] العنوان الدقيق، ورابط خرائط Google، والإحداثيات، وأوقات العمل الصحيحة.
- [ ] أسماء الأخصائيين، ومسمياتهم المهنية وأرقام تصنيفهم، وصورهم (بموافقة).
- [ ] شركات التأمين المتعاقد معها، وخيارات التقسيط إن وجدت.
- [ ] العروض المعتمدة ومدتها، والأسعار المعتمدة إن رغبتم بنشرها.
- [ ] الشعار الرسمي بصيغة SVG، وألوان الهوية إن وُجدت.
- [ ] صور وفيديو حقيقية للمركز والأجهزة.
- [ ] حسابات التواصل الاجتماعي، ومعرّفات البكسلات، وحسابات الإعلانات.
- [ ] بريد رسمي للاستقبال ولطلبات الخصوصية.
- [ ] تأكيد الأجهزة المتوفرة فعليًا ومواصفاتها (مثل موديلات BTL وITO).

---

## 11. خارطة الطريق

| المرحلة | المهام |
|---|---|
| **الأسبوع 1–2** | اعتماد البيانات · ربط Google Sheet والبكسلات وCAPI · تحويل 301 للنطاق المكرر · إعداد Google Business Profile · مراجعة نظامية للمحتوى والعروض · إطلاق صفحتي `back-pain` و`knee`/`alterg` |
| **الأسبوع 3–6** | إطلاق بقية الصفحات · رد واتساب آلي عبر WhatsApp Business API · بدء اختبارات A/B · جلسة تصوير حقيقية · جمع تقييمات Google |
| **الشهر 2–3** | إرسال «حجز مؤكد/حضر» للمنصات والتحسين على الجودة · صفحات حالات إضافية لـ SEO (مثل «علاج عرق النسا في المدينة المنورة») · نسخة إنجليزية للزوار الدوليين |
| **لاحقًا** | نماذج 3D مطابقة للأجهزة من المصنّعين · تقرير نتائج سنوي مجمّع (بعد مراجعة نظامية) · حجز مواعيد فوري مرتبط بنظام العيادة |

---

## المصادر

**الموقع الحالي:**
- [tajalasehaa.sa](https://tajalasehaa.sa/) · [من نحن](https://tajalasehaa.sa/about-us/) · [العلاج المنزلي](https://tajalasehaa.sa/optional-home-physiotherapy/) · [تقنيات التأهيل](https://tajalasehaa.sa/advanced-rehab-tech/) · [التقنيات](https://tajalasehaa.sa/techniques-technologies/)
- [tajalasehaa.site/en](https://tajalasehaa.site/en/)
- [Bayt](https://www.bayt.com/en/company/taj-alasehaa-2259720/)
- [Healife](https://healife.com.my/who-we-are/)
- [Malaysia Gazette](https://malaysiagazette.com/2022/03/03/healife-tawar-penyelesaian-kesihatan-moden-dan-tradisional/)

**المنافسون والأنماط:**
- [PhysioTherabia](https://physiotherabia.com/shop/packages-en/physical-therapy-antigravity-treadmill-hydrotherapy-package/) · [PhysioTrio](https://physiotrio.sa/en) · [Physiowell](https://riyadhkey.com/physiowell-officially-launches-in-riyadh-setting-new-standard-of-rehabilitation-care-in-saudi-arabia/) · [Sumo](https://sumo.sa/en/)
- [ERADAH CARF](https://carf.org/provider/eradah-rehabilitation-centers-374007/) · [First Response](https://firstresponsehealthcare.com/sa/riyadh/physiotherapy-at-home)
- [Hinge](https://www.hingehealth.com/resources/clinical-studies/) · [Sword](https://sword.com/articles/thrive-digital-physical-therapy) · [SRAlab](https://www.sralab.org/sites/default/files/downloads/2025-10/Services%20Outcomes%202025%20Annual%20Report%20V3.pdf) · [ATI](https://therapy.atipt.com/complimentary-screening/) · [Pure](https://puresportsmed.com/services/physiotherapy/)

**الأجهزة:**
- [NHS ESWT](https://www.ouh.nhs.uk/media/35kl5xmx/117207extracorporeal-shockwave-therapy.pdf) · [NICE IPG311](https://www.nice.org.uk/guidance/ipg311) · [NICE NG59](https://www.nice.org.uk/guidance/ng59)
- [UPMC AlterG](https://share.upmc.com/2017/03/alterg-anti-gravity-treadmill/) · [MDedge](https://mdedge.com/content/use-anti-gravity-treadmill-early-postoperative-rehabilitation-after-total-knee-replacement)

**التحويل والحملات:**
- [web.dev: Milliseconds make millions](https://web.dev/case-studies/milliseconds-make-millions) · [HBR 2011](https://scholarsarchive.byu.edu/facpub/9711) · [MIT/InsideSales](https://customerthink.com/are-your-lead-response-practices-costing-you-sales/)
- [DataReportal 2026](https://datareportal.com/reports/digital-2026-saudi-arabia) · [DataReportal 2025](https://datareportal.com/reports/digital-2025-saudi-arabia)
- [Meta Pixel](https://developers.facebook.com/documentation/meta-pixel/reference) · [Meta dedup](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events) · [fbc/fbp](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc)
- [Snap events](https://developers.snap.com/marketing-api/Conversions-API/Parameters) · [Snap dedup](https://developers.snap.com/marketing-api/Conversions-API/Deduplication)
- [TikTok events](https://ads.tiktok.com/help/article/how-to-adopt-tiktoks-updated-standard-events?lang=en) · [TikTok dedup](https://ads.tiktok.com/help/article/event-deduplication)
- [Google enhanced conversions for leads](https://support.google.com/google-ads/answer/15713840?hl=en) · [GA4 generate_lead](https://support.google.com/analytics/answer/9267735)

**الامتثال:**
- [Lexis: وزارة الصحة 2025](https://www.lexis.ae/2025/02/18/ksa-health-ministry-enforces-compliance/) · [نظام مزاولة المهن الصحية](https://www.moh.gov.sa/en/Ministry/Rules/Documents/Law-of-Practicing-Healthcare-Professions.pdf) · [موافقة الخصومات](https://www.moh.gov.sa/eServices/Licences/Documents/10.pdf)
- [تصنيف الهيئة](https://eservices.scfhs.org.sa/en/classification-professional-from-inside-outside-kingdom-) · [سدايا](https://dgp.sdaia.gov.sa)

**3D والأداء:**
- [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) · [drei PerformanceMonitor](https://drei.docs.pmnd.rs/performances/performance-monitor)
- [WCAG 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) · [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [BodyParts3D](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D)
