import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Download, FileText, Lightbulb, Wrench, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";
import SearchEngine from "@/components/SearchEngine";
import CostCalculator from "@/components/CostCalculator";
import SuppliersList from "@/components/SuppliersList";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0A2540] to-[#0D3050] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-8 h-8 text-[#C5A059]" />
            <Lightbulb className="w-8 h-8 text-[#C5A059]" />
          </div>
          <h1 className="text-5xl font-bold mb-4">الدليل الشامل للاستيراد من الصين لملتقى الأوفياء</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            دليل شامل لاستيراد مواد السباكة والكهرباء من الصين إلى المملكة العربية السعودية
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-r-4 border-[#C5A059]">
            <TrendingUp className="w-8 h-8 text-[#C5A059] mb-3" />
            <h3 className="text-lg font-semibold text-[#0A2540] mb-2">حجم السوق</h3>
            <p className="text-3xl font-bold text-[#0A2540]">15-18 مليار</p>
            <p className="text-sm text-gray-600 mt-1">ريال سعودي سنوياً</p>
          </Card>

          <Card className="p-6 border-r-4 border-[#C5A059]">
            <Shield className="w-8 h-8 text-[#C5A059] mb-3" />
            <h3 className="text-lg font-semibold text-[#0A2540] mb-2">معدل النمو</h3>
            <p className="text-3xl font-bold text-[#0A2540]">8-12%</p>
            <p className="text-sm text-gray-600 mt-1">نمو سنوي</p>
          </Card>

          <Card className="p-6 border-r-4 border-[#C5A059]">
            <FileText className="w-8 h-8 text-[#C5A059] mb-3" />
            <h3 className="text-lg font-semibold text-[#0A2540] mb-2">حصة الصين</h3>
            <p className="text-3xl font-bold text-[#0A2540]">45-50%</p>
            <p className="text-sm text-gray-600 mt-1">من الواردات</p>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 mb-8 h-auto">
            <TabsTrigger value="overview" className="cursor-pointer py-3">نظرة عامة</TabsTrigger>
            <TabsTrigger value="plumbing" className="cursor-pointer py-3">مواد السباكة</TabsTrigger>
            <TabsTrigger value="electrical" className="cursor-pointer py-3">مواد الكهرباء</TabsTrigger>
            <TabsTrigger value="process" className="cursor-pointer py-3">العملية</TabsTrigger>
            <TabsTrigger value="search" className="cursor-pointer py-3">البحث</TabsTrigger>
            <TabsTrigger value="calculator" className="cursor-pointer py-3">الحاسبة</TabsTrigger>
            <TabsTrigger value="suppliers" className="cursor-pointer py-3">الموردين</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4">مقدمة عن الاستيراد</h2>
              <p className="text-gray-700 mb-4">
                تشهد صناعة البناء والإنشاء في المملكة العربية السعودية نمواً متسارعاً، مع استثمارات ضخمة في المشاريع السكنية والتجارية والصناعية. يعتمد هذا القطاع بشكل كبير على استيراد مواد السباكة والكهرباء من الصين.
              </p>
              <p className="text-gray-700 mb-6">
                يوفر هذا الدليل شرحاً مفصلاً وعملياً لجميع جوانب الاستيراد، مع التركيز على المتطلبات التنظيمية والرسوم الجمركية والعملية اللوجستية.
              </p>
              <a href="/import-guide.pdf" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#0A2540] hover:bg-[#0D3050] text-white cursor-pointer">
                  اقرأ الدليل الكامل
                  <Download className="w-4 h-4 mr-2" />
                </Button>
              </a>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-bold text-[#0A2540] mb-4">الهيئات التنظيمية الرئيسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-r-4 border-[#C5A059] pr-4 text-right">
                  <h4 className="font-semibold text-[#0A2540] mb-2">ZATCA</h4>
                  <p className="text-sm text-gray-600">هيئة الزكاة والضريبة والجمارك - تدير الجمارك والضرائب والتخليص</p>
                </div>
                <div className="border-r-4 border-[#C5A059] pr-4 text-right">
                  <h4 className="font-semibold text-[#0A2540] mb-2">SASO</h4>
                  <p className="text-sm text-gray-600">الهيئة السعودية للمواصفات والمقاييس والجودة - تحدد المعايير والشهادات</p>
                </div>
                <div className="border-r-4 border-[#C5A059] pr-4 text-right">
                  <h4 className="font-semibold text-[#0A2540] mb-2">MOCI</h4>
                  <p className="text-sm text-gray-600">وزارة التجارة والاستثمار - تصدر التراخيص والتسجيل التجاري</p>
                </div>
                <div className="border-r-4 border-[#C5A059] pr-4 text-right">
                  <h4 className="font-semibold text-[#0A2540] mb-2">SFDA</h4>
                  <p className="text-sm text-gray-600">الهيئة العامة للغذاء والدواء - توافق على المنتجات الكيميائية</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Plumbing Tab */}
          <TabsContent value="plumbing" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4">مواد السباكة</h2>
              <p className="text-gray-700 mb-6">
                تشمل مواد السباكة الأنابيب بأنواعها والصمامات والتجهيزات والأحواض والخلاطات. جميع هذه المنتجات تخضع لمتطلبات SASO صارمة.
              </p>

              <h3 className="text-lg font-semibold text-[#0A2540] mb-4">أكواس HS الرئيسية</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">أنابيب الحديد والصلب</span>
                  <span className="font-mono text-[#C5A059] font-semibold">7306.30.00.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">أنابيب النحاس</span>
                  <span className="font-mono text-[#C5A059] font-semibold">7408.11.00.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">أنابيب البلاستيك (PVC)</span>
                  <span className="font-mono text-[#C5A059] font-semibold">3916.90.00.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">الصمامات والتجهيزات</span>
                  <span className="font-mono text-[#C5A059] font-semibold">8481.80.00.00</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#0A2540] mb-4">متطلبات SABER</h3>
              <ul className="space-y-2 text-gray-700 text-right">
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>شهادة مطابقة المنتج (PCoC) - إلزامية</span>
                </li>
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>اختبارات الضغط والتسرب</span>
                </li>
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>اختبارات المواد والسمية</span>
                </li>
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>وسم عربي واضح على كل منتج</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 border-r-4 border-blue-400 rounded text-right">
                <p className="text-sm text-gray-700">
                  <strong>التكاليف:</strong> رسوم PCoC 800-1,500 ريال + اختبارات 1,000-2,000 ريال = 1,800-3,500 ريال لكل منتج
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Electrical Tab */}
          <TabsContent value="electrical" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4">مواد الكهرباء</h2>
              <p className="text-gray-700 mb-6">
                تشمل مواد الكهرباء الأسلاك والكابلات والقواطع والمفاتيح والمحولات والمصابيح ولوحات التحكم. جميع هذه المنتجات تخضع لاختبارات السلامة الكهربائية الصارمة.
              </p>

              <h3 className="text-lg font-semibold text-[#0A2540] mb-4">أكواس HS الرئيسية</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">الأسلاك والكابلات النحاسية</span>
                  <span className="font-mono text-[#C5A059] font-semibold">8544.30.00.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">القواطع الكهربائية</span>
                  <span className="font-mono text-[#C5A059] font-semibold">8536.50.00.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">المفاتيح الكهربائية</span>
                  <span className="font-mono text-[#C5A059] font-semibold">8537.10.00.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">مصابيح LED والإضاءة</span>
                  <span className="font-mono text-[#C5A059] font-semibold">8539.29.00.00</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#0A2540] mb-4">متطلبات SABER</h3>
              <ul className="space-y-2 text-gray-700 text-right">
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>شهادة مطابقة المنتج (PCoC) - إلزامية</span>
                </li>
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>اختبارات السلامة الكهربائية (IEC 60950)</span>
                </li>
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>اختبارات التوافقية الكهرومغناطيسية (EMC)</span>
                </li>
                <li className="flex items-start gap-3 flex-row-reverse">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>اختبارات الحرارة والرطوبة</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 border-r-4 border-blue-400 rounded text-right">
                <p className="text-sm text-gray-700">
                  <strong>التكاليف:</strong> رسوم PCoC 1,000-2,000 ريال + اختبارات 2,000-4,000 ريال = 3,000-6,000 ريال لكل منتج
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4">عملية التخليص الجمركي</h2>
              <p className="text-gray-700 mb-6">
                يتبع التخليص الجمركي لمواد السباكة والكهرباء 6 خطوات رئيسية:
              </p>

              <div className="space-y-4">
                {[
                  { step: 1, title: "تحضير الوثائق", desc: "جمع جميع الوثائق المطلوبة (3-5 أيام)" },
                  { step: 2, title: "الإرسال عبر FASAH", desc: "تقديم الإقرار الجمركي (5-7 أيام قبل الوصول)" },
                  { step: 3, title: "التحقق من شهادات SABER", desc: "التحقق الآلي من الشهادات (24-48 ساعة)" },
                  { step: 4, title: "الفحص الجمركي", desc: "فحص ذكاء اصطناعي أو فيزيائي (15 دقيقة - 48 ساعة)" },
                  { step: 5, title: "دفع الرسوم والضرائب", desc: "دفع عبر نظام سداد (5 أيام)" },
                  { step: 6, title: "تحرير البضائع", desc: "سحب الحاوية والنقل (1-3 أيام)" }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#C5A059] text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0A2540]">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-50 border-r-4 border-amber-400 rounded">
                <p className="text-sm text-gray-700">
                  <strong>الوقت الإجمالي:</strong> من الإرسال إلى التحرير: 7-14 يوم
                </p>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4">الرسوم الجمركية والضرائب</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">أنابيب معدنية</span>
                  <span className="font-semibold text-[#C5A059]">5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">أنابيب بلاستيكية</span>
                  <span className="font-semibold text-[#C5A059]">10%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">أسلاك وكابلات</span>
                  <span className="font-semibold text-[#C5A059]">5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">قواطع ومفاتيح</span>
                  <span className="font-semibold text-[#C5A059]">10%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">مصابيح LED</span>
                  <span className="font-semibold text-[#C5A059]">15%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded flex-row-reverse">
                  <span className="text-gray-700">ضريبة القيمة المضافة</span>
                  <span className="font-semibold text-[#C5A059]">15%</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <SearchEngine />
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <CostCalculator />
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-6">
            <SuppliersList />
          </TabsContent>
        </Tabs>

        {/* Download Section */}
        <Card className="p-8 bg-gradient-to-r from-[#0A2540] to-[#0D3050] text-white">
          <h2 className="text-2xl font-bold mb-4">تحميل الدليل الكامل والموارد</h2>
          <p className="text-gray-300 mb-6">
            احصل على الدليل الشامل والموارد المتعددة التي تتضمن جميع المعلومات والأمثلة والنماذج والقوالب المطلوبة لاستيراد مواد السباكة والكهرباء بنجاح.
          </p>
          <div className="flex justify-center">
            <a href="/unified-import-guide.pdf" target="_blank" rel="noopener noreferrer" className="w-full md:w-2/3">
              <Button className="w-full bg-[#C5A059] hover:bg-[#B8964A] text-[#0A2540] font-bold text-lg py-8 cursor-pointer shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <Download className="w-6 h-6 ml-3" />
                تحميل الدليل الشامل الموحد (PDF)
                <span className="block text-xs font-normal mt-1 mr-2 opacity-80">
                  (يشمل الدليل، المصادر، النماذج، الموردين، والمقترحات)
                </span>
              </Button>
            </a>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">الموارد</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#C5A059]">FASAH</a></li>
                <li><a href="#" className="hover:text-[#C5A059]">SABER</a></li>
                <li><a href="#" className="hover:text-[#C5A059]">ZATCA</a></li>
                <li><a href="#" className="hover:text-[#C5A059]">SASO</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">المعلومات</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#C5A059]">عن الدليل</a></li>
                <li><a href="#" className="hover:text-[#C5A059]">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-[#C5A059]">اتصل بنا</a></li>
                <li><a href="#" className="hover:text-[#C5A059]">الشروط والأحكام</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">عن المشروع</h3>
              <p className="text-sm text-gray-400">
                دليل شامل متخصص في استيراد مواد السباكة والكهرباء من الصين إلى المملكة العربية السعودية.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 الدليل الشامل للاستيراد من الصين لملتقى الأوفياء. جميع الحقوق محفوظة.</p>
            <p className="mt-2">آخر تحديث: يناير 2026 | الإصدار 2.4 (النسخة الموحدة)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
