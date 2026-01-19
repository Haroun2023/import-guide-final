# دليل استضافة مشروع دليل الاستيراد من الصين إلى السعودية

## نظرة عامة على المشروع

هذا المشروع عبارة عن موقع ويب تفاعلي يقدم دليلاً شاملاً عن استيراد السلع من الصين إلى المملكة العربية السعودية. يتضمن وثائق مفصلة وشرائح تقديمية وموارد تعليمية.

---

## هيكل المشروع

```
import-china-saudi-guide/
├── client/                          # مجلد التطبيق الأمامي (Frontend)
│   ├── public/
│   │   ├── images/                  # الصور والرسوميات
│   │   │   ├── hero-shipping.png
│   │   │   ├── customs-process.png
│   │   │   └── regulations-overview.png
│   │   └── index.html               # ملف HTML الرئيسي
│   ├── src/
│   │   ├── pages/                   # صفحات التطبيق
│   │   │   └── Home.tsx
│   │   ├── components/              # مكونات قابلة لإعادة الاستخدام
│   │   ├── App.tsx                  # مكون التطبيق الرئيسي
│   │   ├── main.tsx                 # نقطة الدخول
│   │   └── index.css                # الأنماط العامة
│   └── package.json                 # اعتماديات المشروع
├── slides/                          # مجلد الشرائح التقديمية
│   ├── slide_1_cover.html
│   ├── slide_2_context.html
│   ├── slide_3_authorities.html
│   ├── slide_4_saber.html
│   ├── slide_5_hs_code.html
│   ├── slide_6_vat.html
│   ├── slide_7_duties.html
│   ├── slide_8_cost_example.html
│   └── ... (المزيد من الشرائح)
├── docs/                            # الوثائق
│   ├── import_guide_complete_ar.md  # الدليل الشامل بالعربية
│   └── DEPLOYMENT_GUIDE_AR.md       # هذا الملف
├── package.json                     # إعدادات المشروع الرئيسية
├── vite.config.ts                   # إعدادات Vite
└── tsconfig.json                    # إعدادات TypeScript
```

---

## متطلبات الاستضافة

### المتطلبات الأساسية

- **Node.js**: الإصدار 18.0 أو أحدث
- **npm** أو **pnpm**: مدير الحزم
- **Git**: لنسخ المشروع (اختياري)

### المتطلبات الاختيارية

- **Docker**: لتشغيل المشروع في حاوية
- **GitHub Pages**: لاستضافة مجانية
- **Vercel**: لاستضافة متقدمة
- **Netlify**: لاستضافة سهلة
- **AWS S3 + CloudFront**: لاستضافة احترافية

---

## خطوات الاستضافة المحلية (للاختبار)

### 1. تثبيت المتطلبات

```bash
# تثبيت Node.js من https://nodejs.org/

# التحقق من التثبيت
node --version
npm --version
```

### 2. نسخ المشروع

```bash
# نسخ المشروع من المجلد
cd /path/to/import-china-saudi-guide

# أو استنساخ من Git (إذا كان متاحاً)
git clone <repository-url>
cd import-china-saudi-guide
```

### 3. تثبيت الاعتماديات

```bash
# استخدام npm
npm install

# أو استخدام pnpm
pnpm install
```

### 4. تشغيل خادم التطوير

```bash
# بدء خادم التطوير
npm run dev

# سيظهر الرابط مثل:
# ➜  Local:   http://localhost:5173/
```

### 5. بناء المشروع للإنتاج

```bash
# بناء النسخة الإنتاجية
npm run build

# ستجد الملفات المجمعة في مجلد dist/
```

---

## خيارات الاستضافة المختلفة

### الخيار 1: GitHub Pages (مجاني)

**المميزات:**
- مجاني تماماً
- سهل الاستخدام
- يدعم النطاقات المخصصة

**الخطوات:**

```bash
# 1. إنشاء مستودع على GitHub
# 2. دفع الملفات إلى GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 3. في إعدادات المستودع:
# - اذهب إلى Settings > Pages
# - اختر "Deploy from a branch"
# - اختر الفرع "main" والمجلد "dist"
# - احفظ الإعدادات

# 4. سيكون الموقع متاحاً على:
# https://username.github.io/import-china-saudi-guide/
```

### الخيار 2: Vercel (مجاني مع خيارات مدفوعة)

**المميزات:**
- استضافة سريعة جداً
- نشر تلقائي من GitHub
- نطاقات مخصصة مجانية

**الخطوات:**

```bash
# 1. اذهب إلى https://vercel.com
# 2. سجل دخول أو أنشئ حساباً
# 3. انقر على "New Project"
# 4. اختر مستودع GitHub
# 5. اختر الإعدادات:
#    - Framework: Vite
#    - Build Command: npm run build
#    - Output Directory: dist
# 6. انقر على "Deploy"

# سيكون الموقع متاحاً على:
# https://your-project.vercel.app/
```

### الخيار 3: Netlify (مجاني مع خيارات مدفوعة)

**المميزات:**
- استضافة سهلة
- نشر تلقائي
- دعم النماذج والوظائف

**الخطوات:**

```bash
# 1. اذهب إلى https://netlify.com
# 2. سجل دخول أو أنشئ حساباً
# 3. انقر على "New site from Git"
# 4. اختر GitHub وحدد المستودع
# 5. اختر الإعدادات:
#    - Build command: npm run build
#    - Publish directory: dist
# 6. انقر على "Deploy site"

# سيكون الموقع متاحاً على:
# https://your-site.netlify.app/
```

### الخيار 4: استضافة تقليدية (Shared Hosting)

**المميزات:**
- تحكم كامل
- نطاقات مخصصة
- تكلفة منخفضة

**الخطوات:**

```bash
# 1. بناء المشروع محلياً
npm run build

# 2. نسخ محتوى مجلد dist/ إلى:
#    public_html/ أو www/ على الخادم

# 3. تأكد من أن ملف index.html موجود في الجذر

# 4. تحديث ملف .htaccess (إذا كان Apache):
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### الخيار 5: Docker (للاستضافة المتقدمة)

**المميزات:**
- توحيد البيئة
- سهولة النشر
- قابلية التوسع

**الخطوات:**

```bash
# 1. إنشاء ملف Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# 2. إنشاء ملف nginx.conf
cat > nginx.conf << 'EOF'
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 3. بناء صورة Docker
docker build -t import-guide .

# 4. تشغيل الحاوية
docker run -p 80:80 import-guide

# 5. الموقع متاح على http://localhost
```

### الخيار 6: AWS S3 + CloudFront

**المميزات:**
- استضافة احترافية
- أداء عالي جداً
- قابلية توسع غير محدودة

**الخطوات:**

```bash
# 1. بناء المشروع
npm run build

# 2. إنشاء دلو S3 على AWS Console

# 3. تثبيت AWS CLI
pip install awscli

# 4. تكوين AWS CLI
aws configure

# 5. رفع الملفات إلى S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# 6. إنشاء توزيع CloudFront
# - اذهب إلى CloudFront Console
# - أنشئ توزيع جديد
# - اختر دلو S3 كمصدر
# - فعّل HTTPS
# - أضف نطاقك المخصص
```

---

## ملفات مهمة للتعديل

### 1. ملف package.json

يحتوي على معلومات المشروع والاعتماديات:

```json
{
  "name": "import-china-saudi-guide",
  "version": "1.0.0",
  "description": "دليل شامل لاستيراد السلع من الصين إلى السعودية",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview --host"
  }
}
```

### 2. ملف vite.config.ts

إعدادات بناء المشروع:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // غيّر إلى اسم المشروع إذا كان في مجلد فرعي
})
```

### 3. ملف index.html

الملف الرئيسي للموقع:

```html
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>دليل الاستيراد من الصين إلى السعودية</title>
    <meta name="description" content="دليل شامل عن استيراد السلع من الصين إلى المملكة العربية السعودية" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## الصور والموارد

### موقع الصور

جميع الصور موجودة في:
```
client/public/images/
├── hero-shipping.png
├── customs-process.png
└── regulations-overview.png
```

### إضافة صور جديدة

1. ضع الصور في مجلد `client/public/images/`
2. استخدمها في الكود:
```html
<img src="/images/your-image.png" alt="وصف الصورة" />
```

---

## متغيرات البيئة

إذا كنت تريد إضافة متغيرات بيئة:

```bash
# أنشئ ملف .env
VITE_API_URL=https://api.example.com
VITE_SITE_NAME=دليل الاستيراد
```

استخدمها في الكود:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## نصائح الأداء

### 1. ضغط الصور

```bash
# استخدم أدوات مثل ImageOptim أو TinyPNG
# لتقليل حجم الصور قبل الرفع
```

### 2. تفعيل الضغط

معظم خوادم الاستضافة تفعّل gzip تلقائياً.

### 3. استخدام CDN

استخدم CDN لتوزيع الملفات الثابتة:
- Cloudflare (مجاني)
- AWS CloudFront
- Bunny CDN

---

## الدعم والصيانة

### تحديث الاعتماديات

```bash
# فحص الاعتماديات القديمة
npm outdated

# تحديث جميع الاعتماديات
npm update

# تحديث اعتماديات محددة
npm install package-name@latest
```

### النسخ الاحتياطية

```bash
# إنشاء نسخة احتياطية من المشروع
tar -czf backup-$(date +%Y%m%d).tar.gz import-china-saudi-guide/

# أو استخدم Git
git tag -a v1.0 -m "Release version 1.0"
git push origin v1.0
```

---

## استكشاف الأخطاء

### المشكلة: الموقع لا يعمل بعد النشر

**الحل:**
1. تحقق من أن ملف `index.html` موجود في مجلد `dist/`
2. تأكد من أن إعدادات الخادم تعيد التوجيه إلى `index.html`
3. تحقق من وحدة التحكم (Console) للأخطاء

### المشكلة: الصور لا تظهر

**الحل:**
1. تحقق من مسار الصور في الكود
2. تأكد من أن الصور موجودة في مجلد `public/`
3. استخدم المسارات النسبية الصحيحة

### المشكلة: الموقع بطيء

**الحل:**
1. استخدم أداة PageSpeed Insights
2. ضغط الصور
3. استخدم CDN
4. فعّل التخزين المؤقت

---

## الخطوات التالية

بعد استضافة الموقع:

1. **أضف نطاقاً مخصصاً** (مثل: import-guide.com)
2. **فعّل HTTPS** (شهادة SSL/TLS)
3. **أضف تحليلات** (Google Analytics)
4. **راقب الأداء** (Uptime monitoring)
5. **حدّث المحتوى** بانتظام

---

## الدعم الإضافي

للمزيد من المساعدة:

- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **Node.js Documentation**: https://nodejs.org/docs/
- **Vercel Documentation**: https://vercel.com/docs
- **Netlify Documentation**: https://docs.netlify.com/

---

**آخر تحديث:** يناير 2026
**الإصدار:** 1.0.0
