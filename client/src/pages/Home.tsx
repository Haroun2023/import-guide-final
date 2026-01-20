import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Download, FileText, Lightbulb, Wrench, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";
import SearchEngine from "@/components/SearchEngine";
import CostCalculator from "@/components/CostCalculator";
import SuppliersList from "@/components/SuppliersList";
import CityRecommendations from "@/components/CityRecommendations";
import ImportRoadmap from "@/components/ImportRoadmap";

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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 mb-8 h-auto gap-2">
            <TabsTrigger value="overview" className="cursor-pointer py-3">نظرة عامة</TabsTrigger>
            <TabsTrigger value="plumbing" className="cursor-pointer py-3">مواد السباكة</TabsTrigger>
            <TabsTrigger value="electrical" className="cursor-pointer py-3">مواد الكهرباء</TabsTrigger>
            <TabsTrigger value="process" className="cursor-pointer py-3">العملية</TabsTrigger>
            <TabsTrigger value="roadmap" className="cursor-pointer py-3">خارطة الطريق</TabsTrigger>
            <TabsTrigger value="search" className="cursor-pointer py-3">البحث</TabsTrigger>
            <TabsTrigger value="calculator" className="cursor-pointer py-3">الحاسبة</TabsTrigger>
            <TabsTrigger value="suppliers" className="cursor-pointer py-3">الموردين</TabsTrigger>
            <TabsTrigger value="cities" className="cursor-pointer py-3">توصيات المدن</TabsTrigger>
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
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-[#0A2540] mb-2">تحميل الدليل الكامل والموارد</h3>
                <p className="text-gray-600 mb-6">احصل على الدليل الشامل والموارد المتعددة التي تتضمن جميع المعلومات والأمثلة والنماذج والقوالب المطلوبة لاستيراد مواد السباكة والكهرباء بنجاح.</p>
                <a href="/unified-import-guide.pdf" target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-auto">
                  <Button className="bg-[#0A2540] hover:bg-[#0D3050] text-white cursor-pointer w-full md:w-auto px-4 md:px-8 py-4 md:py-6 text-base md:text-lg h-auto flex flex-col md:flex-row items-center justify-center gap-2">
                    <Download className="w-6 h-6 md:ml-3 mb-2 md:mb-0" />
                    <span className="text-center">تحميل الدليل الشامل الموحد (PDF)</span>
                  </Button>
                </a>
                <p className="text-xs text-gray-500 mt-3">يشمل: الدليل التفصيلي، قائمة المصادر، النماذج والقوالب، قائمة الموردين، والمقترحات التطويرية</p>
              </div>
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

              <h3 className="text-lg font-semibold text-[#0A2540] mb-4">أكواد HS الرئيسية</h3>
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

              <h3 className="text-lg font-semibold text-[#0A2540] mb-4">أكواد HS الرئيسية</h3>
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
              <h2 className="text-2xl font-bold text-[#0A2540] mb-4">عملية الاستيراد خطوة بخطوة</h2>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-[#C5A059] text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-bold">1</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900">البحث واختيار المنتج</div>
                    </div>
                    <div className="text-slate-500">تحديد المواصفات، البحث في علي بابا، التواصل مع الموردين، وطلب العينات.</div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-[#C5A059] text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-bold">2</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900">التحقق من المتطلبات</div>
                    </div>
                    <div className="text-slate-500">التأكد من متطلبات SASO، تسجيل المنتج في SABER، وإصدار شهادة PCoC.</div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-[#C5A059] text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-bold">3</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900">التعاقد والدفع</div>
                    </div>
                    <div className="text-slate-500">توقيع العقد (PI)، دفع العربون (30%)، وبدء التصنيع.</div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-[#C5A059] text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-bold">4</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900">الشحن والتخليص</div>
                    </div>
                    <div className="text-slate-500">شحن البضاعة، إصدار شهادة SCoC، ودفع الرسوم الجمركية.</div>
                  </div>
                </div>
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
                  <span className="text-gray-700">إضاءة LED</span>
                  <span className="font-semibold text-[#C5A059]">15%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded mt-4 border border-blue-200 flex-row-reverse">
                  <span className="font-bold text-[#0A2540]">ضريبة القيمة المضافة (VAT)</span>
                  <span className="font-bold text-[#0A2540]">15%</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap">
            <ImportRoadmap />
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search">
            <SearchEngine />
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <CostCalculator />
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers">
            <SuppliersList />
          </TabsContent>

          {/* City Recommendations Tab */}
          <TabsContent value="cities">
            <CityRecommendations />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">© 2026 ملتقى الأوفياء - جميع الحقوق محفوظة</p>
          <p className="text-sm text-gray-400">
            إخلاء مسؤولية: المعلومات الواردة في هذا الدليل للأغراض التعليمية فقط. يرجى التحقق من المصادر الرسمية قبل اتخاذ أي قرارات تجارية.
          </p>
          <p className="text-xs text-gray-500 mt-4">الإصدار 2.9 (تحديث شامل)</p>
        </div>
      </footer>
    </div>
  );
}
