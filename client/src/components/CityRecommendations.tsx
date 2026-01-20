import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Building2, Hotel, Home, Factory } from "lucide-react";

const cities = [
  {
    id: "riyadh",
    name: "الرياض",
    icon: Building2,
    description: "العاصمة ومركز الأعمال والمشاريع الكبرى",
    focus: "مشاريع سكنية فاخرة، أبراج مكتبية، ومشاريع القدية",
    recommendations: [
      { name: "أنظمة المنازل الذكية", reason: "طلب عالي في المجمعات السكنية الجديدة" },
      { name: "إضاءة LED ديكورية", reason: "للمشاريع التجارية والمطاعم الفاخرة" },
      { name: "أنابيب PPR معزولة", reason: "لمقاومة الحرارة العالية في الصيف" },
      { name: "كابلات الألياف الضوئية", reason: "للبنية التحتية للمدن الذكية" }
    ]
  },
  {
    id: "jeddah",
    name: "جدة",
    icon: Home,
    description: "بوابة الحرمين ومركز سياحي وتجاري",
    focus: "مشاريع ساحلية، منتجعات، وتطوير وسط جدة",
    recommendations: [
      { name: "مواد كهربائية مقاومة للرطوبة (IP65+)", reason: "بسبب الرطوبة العالية والأجواء الساحلية" },
      { name: "أنابيب CPVC مقاومة للتآكل", reason: "لمقاومة ملوحة الجو والمياه" },
      { name: "خلاطات ستانلس ستيل 316", reason: "لمقاومة الصدأ في المناطق البحرية" },
      { name: "أنظمة تكييف VRF", reason: "للفلل والقصور الساحلية" }
    ]
  },
  {
    id: "makkah_madinah",
    name: "مكة والمدينة",
    icon: Hotel,
    description: "المدن المقدسة ومشاريع الضيافة العملاقة",
    focus: "فنادق، أبراج سكنية للحجاج، وتوسعة المساجد",
    recommendations: [
      { name: "أنظمة إضاءة الفنادق والنجف", reason: "لتجهيز آلاف الغرف الفندقية الجديدة" },
      { name: "أدوات صحية تجارية (Heavy Duty)", reason: "لتحمل الاستخدام الكثيف في المواسم" },
      { name: "قواطع كهربائية صناعية", reason: "للأحمال العالية في الأبراج" },
      { name: "أنظمة إطفاء حريق متطورة", reason: "متطلب أساسي لتراخيص الدفاع المدني" }
    ]
  },
  {
    id: "dammam",
    name: "الدمام والخبر",
    icon: Factory,
    description: "المنطقة الصناعية ومركز الطاقة",
    focus: "مشاريع صناعية، إسكان أرامكو، ومستودعات",
    recommendations: [
      { name: "كابلات صناعية مدرعة", reason: "للمصانع والمنشآت النفطية" },
      { name: "أنابيب ضغط عالي", reason: "للاستخدامات الصناعية وشبكات المياه" },
      { name: "لوحات تحكم صناعية (PLC)", reason: "لأتمتة المصانع وخطوط الإنتاج" },
      { name: "إضاءة High Bay للمستودعات", reason: "للمناطق اللوجستية والمخازن" }
    ]
  }
];

export default function CityRecommendations() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <div className="w-full space-y-6" dir="rtl">
      <Card className="p-8 bg-gradient-to-r from-[#0A2540] to-[#0D3050] text-white">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-[#C5A059]" />
          <h2 className="text-2xl font-bold">توصيات المنتجات حسب المدينة</h2>
        </div>
        <p className="text-gray-300 mb-8">
          اختر مدينتك المستهدفة للحصول على توصيات مخصصة لأفضل مواد السباكة والكهرباء المطلوبة بناءً على طبيعة المشاريع والمناخ.
        </p>

        {/* City Selection Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cities.map((city) => {
            const Icon = city.icon;
            const isSelected = selectedCity.id === city.id;
            return (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                  isSelected
                    ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                    : "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200"
                }`}
              >
                <Icon className="w-8 h-8" />
                <span className="font-bold">{city.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected City Details */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="mb-6 text-center md:text-right">
            <h3 className="text-2xl font-bold text-white mb-2">{selectedCity.name}</h3>
            <p className="text-[#C5A059] font-medium mb-1">{selectedCity.description}</p>
            <p className="text-sm text-gray-400">التركيز: {selectedCity.focus}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCity.recommendations.map((item, index) => (
              <div 
                key={index}
                className="bg-[#0A2540] p-4 rounded-lg border-r-4 border-[#C5A059] hover:bg-[#0f355a] transition-colors"
              >
                <h4 className="font-bold text-white mb-2">{item.name}</h4>
                <p className="text-sm text-gray-300">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
