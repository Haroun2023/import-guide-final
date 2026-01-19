import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, Star } from "lucide-react";

const suppliers = {
  plumbing: [
    {
      name: "Lesso (China Lesso Group)",
      specialty: "أنابيب PVC، تجهيزات، أدوات صحية",
      location: "Guangdong",
      certifications: ["SASO", "ISO 9001", "WaterMark"],
      website: "https://www.lesso.com",
      rating: "ممتاز",
      description: "واحدة من أكبر الشركات المصنعة لمواد البناء والسباكة في الصين، معتمدة وموثوقة في السوق السعودي."
    },
    {
      name: "RIFENG Enterprise",
      specialty: "أنابيب PEX، أنظمة السباكة المتكاملة",
      location: "Foshan",
      certifications: ["SASO", "NSF", "AENOR"],
      website: "https://www.rifeng.com",
      rating: "ممتاز",
      description: "رائدة عالمياً في حلول الأنابيب البلاستيكية، وتصدر كميات ضخمة للشرق الأوسط."
    },
    {
      name: "ERA Co., Ltd.",
      specialty: "صمامات، أنابيب CPVC/UPVC",
      location: "Zhejiang",
      certifications: ["SASO", "CE", "DVGW"],
      website: "https://www.era.com.cn",
      rating: "جيد جداً",
      description: "متخصصة في أنظمة الأنابيب البلاستيكية والصمامات، وتوفر منتجات مطابقة للمواصفات السعودية."
    },
    {
      name: "Huida Sanitary Ware",
      specialty: "أطقم حمامات، خلاطات، سيراميك",
      location: "Tangshan",
      certifications: ["SASO", "WaterSense"],
      website: "https://www.huidagroup.com",
      rating: "ممتاز",
      description: "علامة تجارية معروفة بجودة السيراميك والأدوات الصحية، ولها حضور قوي في المعارض السعودية."
    },
    {
      name: "JOMOO Kitchen & Bath",
      specialty: "خلاطات ذكية، دش، إكسسوارات",
      location: "Fujian",
      certifications: ["SASO", "Red Dot Award"],
      website: "https://www.jomoo.com",
      rating: "ممتاز",
      description: "تركز على التكنولوجيا والابتكار في منتجات المطابخ والحمامات."
    },
    {
      name: "Amico Group",
      specialty: "أنابيب نحاسية، صمامات، عدادات مياه",
      location: "Ningbo",
      certifications: ["SASO", "ISO 14001"],
      website: "http://www.amico.cn",
      rating: "جيد جداً",
      description: "مجموعة صناعية كبيرة تنتج مجموعة واسعة من منتجات السباكة والري."
    },
    {
      name: "Kingston Sanitary Ware",
      specialty: "أحواض، بانيوهات، جاكوزي",
      location: "Foshan",
      certifications: ["SASO", "CE"],
      website: "http://www.kingston.com.cn",
      rating: "جيد",
      description: "توفر حلولاً اقتصادية ومتوسطة التكلفة مناسبة للمشاريع التجارية."
    },
    {
      name: "Zhuji Fengfan Piping",
      specialty: "تجهيزات نحاسية، صمامات PEX",
      location: "Zhejiang",
      certifications: ["SASO", "ISO"],
      website: "http://www.fengfan.com",
      rating: "جيد",
      description: "متخصصة في التجهيزات النحاسية عالية الجودة وأنظمة التدفئة."
    },
    {
      name: "Foshan Shunde Gorlde",
      specialty: "أحواض مطبخ ستانلس ستيل",
      location: "Guangdong",
      certifications: ["SASO", "CUPC"],
      website: "http://www.gorlde.com",
      rating: "جيد جداً",
      description: "متخصصة في أحواض المطابخ المصنوعة من الفولاذ المقاوم للصدأ."
    },
    {
      name: "Yuhuan Valogin",
      specialty: "صمامات نحاسية وبرونزية",
      location: "Zhejiang",
      certifications: ["SASO", "ACS"],
      website: "http://www.valogin.com",
      rating: "جيد",
      description: "مصنع متخصص في الصمامات بأنواعها، ويصدر لأوروبا والشرق الأوسط."
    }
  ],
  electrical: [
    {
      name: "Chint Electric",
      specialty: "قواطع، مفاتيح، محولات",
      location: "Zhejiang",
      certifications: ["SASO", "KEMA", "UL"],
      website: "https://chintglobal.com",
      rating: "ممتاز",
      description: "أكبر مصنع للمنتجات الكهربائية منخفضة الجهد في آسيا، وموثوق جداً في السعودية."
    },
    {
      name: "Delixi Electric",
      specialty: "توزيع كهرباء، أتمتة صناعية",
      location: "Wenzhou",
      certifications: ["SASO", "CE"],
      website: "https://www.delixi-electric.com",
      rating: "ممتاز",
      description: "شراكة مع شنايدر إلكتريك، تقدم منتجات عالية الجودة بأسعار تنافسية."
    },
    {
      name: "Bull Group",
      specialty: "أفياش، مفاتيح، وصلات تمديد",
      location: "Zhejiang",
      certifications: ["SASO", "CCC"],
      website: "https://www.gongniu.cn",
      rating: "ممتاز",
      description: "العلامة التجارية رقم 1 في الصين للمفاتيح والأفياش، وتتميز بتصاميم عصرية."
    },
    {
      name: "NVC Lighting",
      specialty: "إضاءة LED تجارية وسكنية",
      location: "Guangdong",
      certifications: ["SASO", "CB"],
      website: "https://www.nvc-lighting.com",
      rating: "ممتاز",
      description: "واحدة من أكبر شركات الإضاءة في العالم، توفر حلول إضاءة متكاملة."
    },
    {
      name: "Opple Lighting",
      specialty: "لمبات LED، إضاءة ذكية",
      location: "Shanghai",
      certifications: ["SASO", "TUV"],
      website: "https://www.opple.com",
      rating: "جيد جداً",
      description: "معروفة بمنتجات الإضاءة المنزلية والذكية ذات الجودة العالية."
    },
    {
      name: "Hengtong Group",
      specialty: "كابلات طاقة، ألياف بصرية",
      location: "Jiangsu",
      certifications: ["SASO", "UL"],
      website: "http://www.hengtonggroup.com",
      rating: "ممتاز",
      description: "عملاق صناعة الكابلات، مناسب للمشاريع الكبيرة والبنية التحتية."
    },
    {
      name: "Far East Cable",
      specialty: "أسلاك وكابلات كهربائية",
      location: "Jiangsu",
      certifications: ["SASO", "CE"],
      website: "http://www.fese.com",
      rating: "جيد جداً",
      description: "أكبر مصنع للكابلات في الصين، يوفر جميع أنواع الكابلات الكهربائية."
    },
    {
      name: "Sassin International",
      specialty: "قواطع دوائر، كونتاكتورات",
      location: "Shanghai",
      certifications: ["SASO", "Semko"],
      website: "http://www.sassin.com",
      rating: "جيد",
      description: "خيار اقتصادي وموثوق للمكونات الكهربائية الصناعية والسكنية."
    },
    {
      name: "Midea Lighting",
      specialty: "إضاءة، مراوح، مفاتيح",
      location: "Guangdong",
      certifications: ["SASO", "ISO"],
      website: "https://www.midea.com",
      rating: "جيد جداً",
      description: "جزء من مجموعة ميديا العملاقة، توفر منتجات إضاءة وكهرباء موثوقة."
    },
    {
      name: "Simon Electric (China)",
      specialty: "مفاتيح وأفياش فاخرة",
      location: "Shanghai",
      certifications: ["SASO", "IEC"],
      website: "https://www.simon.com.cn",
      rating: "ممتاز",
      description: "فرع الشركة الإسبانية في الصين، يقدم تصاميم أوروبية بجودة عالية."
    }
  ]
};

export default function SuppliersList() {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          <strong>ملاحظة هامة:</strong> هذه القائمة استرشادية لأبرز المصانع الصينية المعتمدة والتي لها سابقة أعمال في السوق السعودي. يُنصح دائماً بالتحقق من شهادات SASO الحالية قبل التعاقد.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#0A2540] mb-4 flex items-center gap-2">
          <WrenchIcon className="w-6 h-6 text-[#C5A059]" />
          موردو مواد السباكة (Plumbing)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.plumbing.map((supplier, index) => (
            <SupplierCard key={index} supplier={supplier} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#0A2540] mb-4 flex items-center gap-2">
          <LightbulbIcon className="w-6 h-6 text-[#C5A059]" />
          موردو مواد الكهرباء (Electrical)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.electrical.map((supplier, index) => (
            <SupplierCard key={index} supplier={supplier} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: any }) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow border-t-4 border-t-[#C5A059]">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg text-[#0A2540]">{supplier.name}</h4>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {supplier.rating}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
        <span className="font-semibold">الموقع:</span> {supplier.location}
      </p>
      
      <p className="text-gray-700 text-sm mb-4 min-h-[40px]">{supplier.description}</p>
      
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-1">التخصص:</p>
        <p className="text-sm text-[#0A2540]">{supplier.specialty}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {supplier.certifications.map((cert: string, i: number) => (
          <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
            {cert}
          </Badge>
        ))}
      </div>
      
      <a 
        href={supplier.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#C5A059] hover:text-[#0A2540] text-sm font-semibold flex items-center gap-1 transition-colors"
      >
        زيارة الموقع الرسمي <ExternalLink className="w-3 h-3" />
      </a>
    </Card>
  );
}

function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function LightbulbIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}
