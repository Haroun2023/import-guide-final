import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Product {
  name: string;
  hsCode: string;
  rate: number;
  category: string;
  requirements: string[];
  testingCost: string;
  sasoStandard: string;
}

const products: Product[] = [
  {
    name: "أنابيب الحديد والصلب",
    hsCode: "7306.30.00.00",
    rate: 5,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الضغط", "اختبارات التسرب"],
    testingCost: "1,800-3,500 ريال",
    sasoStandard: "SASO 1068",
  },
  {
    name: "أنابيب النحاس",
    hsCode: "7408.11.00.00",
    rate: 5,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الضغط", "اختبارات المواد"],
    testingCost: "1,800-3,500 ريال",
    sasoStandard: "SASO 1068",
  },
  {
    name: "أنابيب البلاستيك (PVC)",
    hsCode: "3916.90.00.00",
    rate: 10,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الضغط", "اختبارات السمية"],
    testingCost: "1,800-3,500 ريال",
    sasoStandard: "SASO 1066",
  },
  {
    name: "الصمامات والتجهيزات",
    hsCode: "8481.80.00.00",
    rate: 10,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الضغط", "اختبارات الأداء"],
    testingCost: "2,000-4,000 ريال",
    sasoStandard: "SASO 1067",
  },
  {
    name: "أدوات الربط والمشابك",
    hsCode: "7308.90.00.00",
    rate: 5,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الجودة"],
    testingCost: "1,500-3,000 ريال",
    sasoStandard: "SASO 1068",
  },
  {
    name: "أحواض الحمام والمراحيض",
    hsCode: "6910.10.00.00",
    rate: 12,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الضغط", "اختبارات السمية"],
    testingCost: "2,000-4,000 ريال",
    sasoStandard: "SASO 1069",
  },
  {
    name: "الخلاطات والرشاشات",
    hsCode: "8481.80.00.00",
    rate: 10,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الأداء"],
    testingCost: "2,000-4,000 ريال",
    sasoStandard: "SASO 1067",
  },
  {
    name: "مواسير الصرف والتصريف",
    hsCode: "3917.39.00.00",
    rate: 10,
    category: "مواد السباكة",
    requirements: ["شهادة PCoC", "اختبارات الضغط"],
    testingCost: "1,800-3,500 ريال",
    sasoStandard: "SASO 1066",
  },
  {
    name: "الأسلاك والكابلات النحاسية",
    hsCode: "8544.30.00.00",
    rate: 5,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات السلامة الكهربائية", "اختبارات EMC"],
    testingCost: "3,000-6,000 ريال",
    sasoStandard: "SASO 2050",
  },
  {
    name: "القواطع الكهربائية",
    hsCode: "8536.50.00.00",
    rate: 10,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات السلامة الكهربائية", "اختبارات الحرارة"],
    testingCost: "3,000-6,000 ريال",
    sasoStandard: "SASO 2051",
  },
  {
    name: "المفاتيح الكهربائية",
    hsCode: "8537.10.00.00",
    rate: 10,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات السلامة الكهربائية"],
    testingCost: "3,000-6,000 ريال",
    sasoStandard: "SASO 2051",
  },
  {
    name: "الصناديق والتوزيعات",
    hsCode: "7326.90.00.00",
    rate: 10,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات الجودة"],
    testingCost: "2,500-5,000 ريال",
    sasoStandard: "SASO 2054",
  },
  {
    name: "المحولات الكهربائية",
    hsCode: "8504.23.00.00",
    rate: 5,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات السلامة الكهربائية", "اختبارات الأداء"],
    testingCost: "3,500-7,000 ريال",
    sasoStandard: "SASO 2052",
  },
  {
    name: "لوحات التحكم والتوزيع",
    hsCode: "8537.10.00.00",
    rate: 10,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات السلامة الكهربائية", "اختبارات EMC"],
    testingCost: "4,000-8,000 ريال",
    sasoStandard: "SASO 2054",
  },
  {
    name: "مصابيح LED والإضاءة",
    hsCode: "8539.29.00.00",
    rate: 15,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات السلامة الكهربائية", "اختبارات الحرارة"],
    testingCost: "3,000-6,000 ريال",
    sasoStandard: "SASO 2053",
  },
  {
    name: "أجهزة الحماية والقطع",
    hsCode: "8536.50.00.00",
    rate: 10,
    category: "مواد الكهرباء",
    requirements: ["شهادة PCoC", "اختبارات السلامة الكهربائية"],
    testingCost: "3,000-6,000 ريال",
    sasoStandard: "SASO 2051",
  },
];

export default function SearchEngine() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.hsCode.includes(searchQuery) ||
        product.sasoStandard.includes(searchQuery);

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="w-full space-y-6" dir="rtl">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-8 h-8 text-[#C5A059]" />
          <h2 className="text-2xl font-bold text-[#0A2540]">محرك البحث المتقدم</h2>
        </div>
        <p className="text-gray-700 mb-6">
          ابحث عن أكواس HS والمتطلبات والشهادات المطلوبة لكل منتج
        </p>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث عن اسم المنتج أو كود HS أو معيار SASO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3">الفئة</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#0A2540] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category === "all" ? "جميع الفئات" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600">
          تم العثور على <strong>{filteredProducts.length}</strong> منتج
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Card key={index} className="p-6 border-r-4 border-[#C5A059]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540] mb-3">{product.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">كود HS:</span>
                        <p className="font-mono font-semibold text-[#C5A059] mt-1">
                          {product.hsCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">معيار SASO:</span>
                        <p className="font-semibold text-[#0A2540] mt-1">{product.sasoStandard}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">الفئة:</span>
                        <p className="font-semibold text-[#0A2540] mt-1">{product.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="mb-4">
                      <span className="text-gray-600 text-sm">الرسم الجمركي</span>
                      <p className="text-3xl font-bold text-[#C5A059]">{product.rate}%</p>
                    </div>

                    <div className="mb-4">
                      <span className="text-gray-600 text-sm">تكاليف الاختبار والشهادات</span>
                      <p className="font-semibold text-[#0A2540]">{product.testingCost}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">المتطلبات</span>
                      <ul className="mt-2 space-y-1">
                        {product.requirements.map((req, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-[#C5A059] font-bold">✓</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">لم يتم العثور على نتائج. جرب البحث بكلمات أخرى.</p>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}
