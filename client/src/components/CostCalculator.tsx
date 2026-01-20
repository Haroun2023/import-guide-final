import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface CalculationResult {
  invoiceValue: number;
  shippingCost: number;
  insurance: number;
  cifValue: number;
  customsDuty: number;
  subtotal: number;
  vat: number;
  portFees: number;
  clearanceFees: number;
  inspectionFees: number;
  totalPayable: number;
  costPerUnit: number;
}

const productCategories = [
  { name: "أنابيب الحديد والصلب", code: "7306.30.00.00", rate: 5 },
  { name: "أنابيب النحاس", code: "7408.11.00.00", rate: 5 },
  { name: "أنابيب البلاستيك (PVC)", code: "3916.90.00.00", rate: 10 },
  { name: "الصمامات والتجهيزات", code: "8481.80.00.00", rate: 10 },
  { name: "الأسلاك والكابلات النحاسية", code: "8544.30.00.00", rate: 5 },
  { name: "القواطع الكهربائية", code: "8536.50.00.00", rate: 10 },
  { name: "المفاتيح الكهربائية", code: "8537.10.00.00", rate: 10 },
  { name: "مصابيح LED والإضاءة", code: "8539.29.00.00", rate: 15 },
];

const containerTypes = [
  { id: "20ft", name: "حاوية 20 قدم", cost: 2150 },
  { id: "40ft", name: "حاوية 40 قدم", cost: 3800 },
  { id: "lcl", name: "شحن جزئي (LCL)", cost: 0 }, // Cost depends on volume
];

export default function CostCalculator() {
  const [invoiceValue, setInvoiceValue] = useState<number>(5000);
  const [containerType, setContainerType] = useState<string>("20ft");
  const [customShippingCost, setCustomShippingCost] = useState<number>(2150);
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedProduct, setSelectedProduct] = useState<number>(2);
  const [includeInspection, setIncludeInspection] = useState<boolean>(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleContainerChange = (type: string) => {
    setContainerType(type);
    const container = containerTypes.find(c => c.id === type);
    if (container && container.cost > 0) {
      setCustomShippingCost(container.cost);
    }
  };

  const calculateCosts = () => {
    const product = productCategories[selectedProduct];
    const exchangeRate = 3.75;

    // Calculate CIF value
    const insurance = invoiceValue * 0.02;
    const cifValue = invoiceValue + customShippingCost + insurance;
    const cifValueSAR = cifValue * exchangeRate;

    // Calculate customs duty
    const customsDuty = cifValueSAR * (product.rate / 100);

    // Calculate subtotal
    const subtotal = cifValueSAR + customsDuty;

    // Calculate VAT (15%)
    const vat = subtotal * 0.15;

    // Calculate additional fees
    const portFees = containerType === "lcl" ? 100 : (containerType === "40ft" ? 350 : 200);
    const clearanceFees = 300;
    const inspectionFees = includeInspection ? 1200 : 0;

    // Calculate total payable
    const totalPayable = subtotal + vat + portFees + clearanceFees + inspectionFees;

    // Cost per unit
    const costPerUnit = totalPayable / quantity;

    setResult({
      invoiceValue,
      shippingCost: customShippingCost,
      insurance,
      cifValue,
      customsDuty,
      subtotal,
      vat,
      portFees,
      clearanceFees,
      inspectionFees,
      totalPayable,
      costPerUnit,
    });
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      <Card className="p-8 bg-gradient-to-r from-[#0A2540] to-[#0D3050] text-white">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-[#C5A059]" />
          <h2 className="text-2xl font-bold">آلة حاسبة التكاليف الجمركية والضرائب</h2>
        </div>
        <p className="text-gray-300 mb-6">
          احسب التكاليف الإجمالية للاستيراد بما في ذلك الرسوم الجمركية والضرائب والرسوم الإضافية
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">نوع المنتج</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(parseInt(e.target.value))}
              className="w-full p-3 bg-[#0A2540] border border-[#C5A059] rounded text-white"
            >
              {productCategories.map((product, index) => (
                <option key={index} value={index}>
                  {product.name} ({product.rate}%)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-2">
              كود HS: {productCategories[selectedProduct].code}
            </p>
          </div>

          {/* Container Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">نوع الحاوية</label>
            <select
              value={containerType}
              onChange={(e) => handleContainerChange(e.target.value)}
              className="w-full p-3 bg-[#0A2540] border border-[#C5A059] rounded text-white"
            >
              {containerTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Value */}
          <div>
            <label className="block text-sm font-semibold mb-2">قيمة الفاتورة (دولار)</label>
            <input
              type="number"
              value={invoiceValue}
              onChange={(e) => setInvoiceValue(parseFloat(e.target.value))}
              className="w-full p-3 bg-[#0A2540] border border-[#C5A059] rounded text-white"
            />
          </div>

          {/* Shipping Cost */}
          <div>
            <label className="block text-sm font-semibold mb-2">تكلفة الشحن (دولار)</label>
            <input
              type="number"
              value={customShippingCost}
              onChange={(e) => setCustomShippingCost(parseFloat(e.target.value))}
              className="w-full p-3 bg-[#0A2540] border border-[#C5A059] rounded text-white"
            />
            <p className="text-xs text-gray-400 mt-2">
              {containerType === "20ft" && "متوسط السعر: 2,150 دولار"}
              {containerType === "40ft" && "متوسط السعر: 3,800 دولار"}
              {containerType === "lcl" && "يعتمد السعر على الحجم (CBM)"}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold mb-2">الكمية (طن)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              className="w-full p-3 bg-[#0A2540] border border-[#C5A059] rounded text-white"
            />
          </div>
        </div>

        {/* Inspection Checkbox */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer flex-row-reverse justify-end">
            <span className="text-sm">إضافة رسوم فحص جمركي (1,200 ريال)</span>
            <input
              type="checkbox"
              checked={includeInspection}
              onChange={(e) => setIncludeInspection(e.target.checked)}
              className="w-4 h-4"
            />
          </label>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={calculateCosts}
          className="w-full bg-[#C5A059] hover:bg-[#B8964A] text-[#0A2540] font-semibold py-3"
        >
          احسب التكاليف
        </Button>
      </Card>

      {/* Results */}
      {result && (
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-[#0A2540] mb-6">نتائج الحساب</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* CIF Calculation */}
            <div className="border-r-4 border-[#C5A059] pr-4 text-right">
              <h4 className="font-semibold text-[#0A2540] mb-3">قيمة CIF</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">${result.invoiceValue.toFixed(2)}</span>
                  <span>قيمة الفاتورة:</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">${result.shippingCost.toFixed(2)}</span>
                  <span>تكلفة الشحن ({containerTypes.find(c => c.id === containerType)?.name}):</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">${result.insurance.toFixed(2)}</span>
                  <span>التأمين (2%):</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t flex-row-reverse">
                  <span className="font-mono">${result.cifValue.toFixed(2)}</span>
                  <span>قيمة CIF:</span>
                </div>
              </div>
            </div>

            {/* Customs and VAT */}
            <div className="border-r-4 border-[#C5A059] pr-4 text-right">
              <h4 className="font-semibold text-[#0A2540] mb-3">الرسوم والضرائب</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">{(result.cifValue * 3.75).toFixed(0)} ر.س</span>
                  <span>قيمة CIF (ريال):</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">{result.customsDuty.toFixed(0)} ر.س</span>
                  <span>الرسوم الجمركية:</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">{result.vat.toFixed(0)} ر.س</span>
                  <span>ضريبة القيمة المضافة (15%):</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t flex-row-reverse">
                  <span className="font-mono">{result.subtotal.toFixed(0)} ر.س</span>
                  <span>المجموع الفرعي:</span>
                </div>
              </div>
            </div>

            {/* Additional Fees */}
            <div className="border-r-4 border-[#C5A059] pr-4 text-right">
              <h4 className="font-semibold text-[#0A2540] mb-3">الرسوم الإضافية</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">{result.portFees.toFixed(0)} ر.س</span>
                  <span>رسوم الميناء:</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span className="font-mono">{result.clearanceFees.toFixed(0)} ر.س</span>
                  <span>رسوم التخليص:</span>
                </div>
                {result.inspectionFees > 0 && (
                  <div className="flex justify-between flex-row-reverse">
                    <span className="font-mono">{result.inspectionFees.toFixed(0)} ر.س</span>
                    <span>رسوم الفحص:</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total and Per Unit */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#0D3050] text-white p-4 rounded border-r-4 border-[#C5A059] text-right">
              <h4 className="font-semibold mb-3">الإجمالي</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-300 mb-1">المبلغ الإجمالي المستحق</p>
                  <p className="text-2xl font-bold text-[#C5A059]">
                    {result.totalPayable.toFixed(0)} ر.س
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-300 mb-1">التكلفة لكل طن</p>
                  <p className="text-xl font-bold">
                    {result.costPerUnit.toFixed(0)} ر.س
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-blue-50 border-r-4 border-blue-400 rounded text-right">
            <h4 className="font-semibold text-[#0A2540] mb-2">ملخص الحساب</h4>
            <p className="text-sm text-gray-700">
              للاستيراد بقيمة <strong>${result.invoiceValue.toFixed(2)}</strong> من{" "}
              <strong>{productCategories[selectedProduct].name}</strong> بكمية{" "}
              <strong>{quantity} طن</strong> عبر <strong>{containerTypes.find(c => c.id === containerType)?.name}</strong>، المبلغ الإجمالي المستحق هو{" "}
              <strong className="text-[#C5A059]">{result.totalPayable.toFixed(0)} ريال سعودي</strong>
              ، بمعدل <strong>{result.costPerUnit.toFixed(0)} ريال</strong> لكل طن.
            </p>
          </div>

          {/* Notes */}
          <div className="mt-6 p-4 bg-amber-50 border-r-4 border-amber-400 rounded text-right">
            <h4 className="font-semibold text-[#0A2540] mb-2">ملاحظات مهمة</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• هذا الحساب تقريبي ولا يشمل رسوم SABER والشهادات</li>
              <li>• قد تختلف الأسعار الفعلية حسب سعر الصرف والموانئ المختلفة</li>
              <li>• يُنصح بالتحقق من الأسعار الحالية من ZATCA قبل الاستيراد</li>
              <li>• تكاليف الشحن قد تختلف حسب الموسم والمسافة</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
