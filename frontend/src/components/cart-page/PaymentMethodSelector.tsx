"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type PaymentMethod = "BANK_TRANSFER" | "NAPAS_BANK_TRANSFER";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onValueChange: (value: PaymentMethod) => void;
  className?: string;
}

const paymentMethods: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    value: "BANK_TRANSFER",
    label: "Chuyển khoản ngân hàng",
    description: "Thanh toán qua chuyển khoản ngân hàng",
  },
  {
    value: "NAPAS_BANK_TRANSFER",
    label: "NAPAS",
    description: "Thanh toán qua hệ thống NAPAS",
  },
];

export default function PaymentMethodSelector({
  value,
  onValueChange,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-base font-semibold text-black md:text-lg">
        Phương thức thanh toán
      </Label>
      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.value}
              className={cn(
                "cursor-pointer transition-all hover:border-black/30",
                value === method.value && "border-black border-2",
              )}
              onClick={() => onValueChange(method.value)}
            >
              <CardContent className="flex items-center space-x-3 p-4">
                <RadioGroupItem value={method.value} id={method.value} />
                <div className="flex-1">
                  <Label
                    htmlFor={method.value}
                    className="cursor-pointer font-medium text-black"
                  >
                    {method.label}
                  </Label>
                  <p className="text-sm text-black/60">{method.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

