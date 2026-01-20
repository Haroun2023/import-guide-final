import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowDown } from "lucide-react";

const roadmapSteps = [
  {
    id: 1,
    title: "البحث واختيار المنتج",
    description: "تحديد المواصفات الفنية، البحث في علي بابا، والتواصل مع الموردين.",
    checklist: [
      "تحديد مواصفات المنتج بدقة (HS Code)",
      "الحصول على 3 عروض أسعار على الأقل",
      "طلب عينات وفحصها",
      "التحقق من موثوقية المورد"
    ]
  },
  {
    id: 2,
    title: "التحقق من المتطلبات التنظيمية",
    description: "التأكد من متطلبات SASO و SABER قبل الشراء.",
    checklist: [
      "تسجيل المنتج في منصة SABER",
      "إصدار شهادة PCoC (شهادة المطابقة)",
      "التأكد من وجود بطاقة البيانات على المنتج",
      "التحقق من متطلبات كفاءة الطاقة (إن وجدت)"
    ]
  },
  {
    id: 3,
    title: "التعاقد والدفع",
    description: "توقيع العقد ودفع العربون وبدء التصنيع.",
    checklist: [
      "توقيع عقد مفصل (PI) يتضمن شروط الشحن",
      "دفع العربون (عادة 30%) عبر قناة آمنة",
      "متابعة عملية التصنيع",
      "ترتيب فحص الجودة قبل الشحن"
    ]
  },
  {
    id: 4,
    title: "الشحن والتخليص",
    description: "شحن البضاعة وإعداد المستندات للتخليص الجمركي.",
    checklist: [
      "حجز الحاوية وتحديد موعد الشحن",
      "استلام بوليصة الشحن (BL) والفاتورة وشهادة المنشأ",
      "إصدار شهادة SCoC (شهادة الإرسالية) في SABER",
      "دفع الرسوم الجمركية والضريبة"
    ]
  },
  {
    id: 5,
    title: "الاستلام والتخزين",
    description: "وصول البضاعة للمستودع وفحصها النهائي.",
    checklist: [
      "استلام البضاعة من الميناء",
      "فحص البضاعة للتأكد من سلامتها",
      "تخزين المواد بشكل صحيح",
      "تسجيل المخزون في النظام"
    ]
  }
];

export default function ImportRoadmap() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("importRoadmapProgress");
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);

  // Save progress to localStorage
  const toggleStep = (id: number) => {
    const newCompleted = completedSteps.includes(id)
      ? completedSteps.filter(stepId => stepId !== id)
      : [...completedSteps, id];
    
    setCompletedSteps(newCompleted);
    localStorage.setItem("importRoadmapProgress", JSON.stringify(newCompleted));
    
    // Auto expand next step if completed
    if (!completedSteps.includes(id)) {
      setExpandedStep(id < 5 ? id + 1 : null);
    }
  };

  const calculateProgress = () => {
    return Math.round((completedSteps.length / roadmapSteps.length) * 100);
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      <Card className="p-8 bg-white border-t-4 border-[#C5A059]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0A2540]">خارطة طريق الاستيراد</h2>
            <p className="text-gray-600 mt-1">تتبع رحلة استيرادك خطوة بخطوة</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#C5A059]">{calculateProgress()}%</div>
            <div className="text-xs text-gray-500">مكتمل</div>
          </div>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute right-[19px] top-4 bottom-4 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {roadmapSteps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isExpanded = expandedStep === step.id;

              return (
                <div key={step.id} className="relative pr-12">
                  {/* Step Icon */}
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`absolute right-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                      isCompleted
                        ? "bg-[#C5A059] border-[#C5A059] text-white"
                        : "bg-white border-gray-300 text-gray-400 hover:border-[#C5A059]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{step.id}</span>}
                  </button>

                  {/* Step Content */}
                  <div 
                    className={`border rounded-lg transition-all duration-300 overflow-hidden ${
                      isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      <div>
                        <h3 className={`font-bold text-lg ${isCompleted ? "text-green-800" : "text-[#0A2540]"}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                      <ArrowDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {/* Checklist */}
                    <div 
                      className={`transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50">
                        <h4 className="font-semibold text-sm text-gray-700 mb-3 mt-3">قائمة المهام:</h4>
                        <ul className="space-y-2">
                          {step.checklist.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <Circle className="w-4 h-4 mt-0.5 text-[#C5A059]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
