'use client';

import type React from 'react';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Separator} from '@/components/ui/separator';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {useState} from 'react';

export const AdPaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const adId = params.id as string;

  // Mock ad data - in a real app, this would be fetched from an API
  const adData = {
    id: adId,
    name:
      adId === 'summer-sale' ? 'Summer Sale Promotion' : 'New Product Launch',
    type: adId === 'summer-sale' ? 'Feed Ad' : 'Banner Ad',
    plan: adId === 'summer-sale' ? 'Professional' : 'Enterprise',
    duration: '30 days',
    price: adId === 'summer-sale' ? 269 : 499,
    status: 'Approved',
    approvedDate: 'June 15, 2023',
  };

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div>
        <div className="max-w-3xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
            <p className="text-app-gray mb-6">
              Your ad campaign has been paid for and is now active. It will run
              for the selected duration.
            </p>
            <div className="bg-app-hover p-6 rounded-lg mb-6 text-left">
              <h3 className="font-medium mb-4">Campaign Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Campaign:</span> {adData.name}
                </div>
                <div>
                  <span className="font-medium">Ad Type:</span> {adData.type}
                </div>
                <div>
                  <span className="font-medium">Plan:</span> {adData.plan}
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{' '}
                  {adData.duration}
                </div>
                <div>
                  <span className="font-medium">Amount:</span> ${adData.price}
                </div>
                <div>
                  <span className="font-medium">Status:</span> Active
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-app hover:bg-app/90">
                <Link href="/dashboard/ads">
                  View Ad Performance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/advertise">Create Another Ad</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white backdrop-blur-sm border-b border-gray-200 md:top-0 top-[57px] p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/ads">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Complete Payment</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="bg-app/10 border border-app/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-app font-medium mb-1">
                <CheckCircle className="h-5 w-5 text-app" />
                <h3>Your Ad Has Been Approved</h3>
              </div>
              <p className="text-sm text-app">
                Congratulations! Your ad "{adData.name}" has been approved and
                is ready to go live. Complete payment to start your campaign.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your ad campaign details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Ad Name:</span>
                    <span className="text-sm font-medium">{adData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ad Type:</span>
                    <span className="text-sm font-medium">{adData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Plan:</span>
                    <span className="text-sm font-medium">{adData.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="text-sm font-medium">
                      {adData.duration}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>${adData.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes:</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${adData.price}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="mb-4">
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem
                            value="credit-card"
                            id="credit-card"
                            className="text-app border-app"
                          />
                          <Label
                            htmlFor="credit-card"
                            className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="h-5 w-5 text-app-gray" />
                            Credit / Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md opacity-60">
                          <RadioGroupItem
                            className="border-app"
                            value="paypal"
                            id="paypal"
                            disabled
                          />
                          <Label
                            htmlFor="paypal"
                            className="cursor-not-allowed">
                            PayPal (Coming Soon)
                          </Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === 'credit-card' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                              id="card-number"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={e => setCardNumber(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="card-name">Cardholder Name</Label>
                            <Input
                              id="card-name"
                              placeholder="John Doe"
                              value={cardName}
                              onChange={e => setCardName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry-date">Expiry Date</Label>
                              <Input
                                id="expiry-date"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={e => setExpiryDate(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={e => setCvv(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="billing-address">
                              Billing Address
                            </Label>
                            <Input
                              id="billing-address"
                              placeholder="123 Main St, City, Country"
                              value={billingAddress}
                              onChange={e => setBillingAddress(e.target.value)}
                              required
                            />
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                              id="save-payment"
                              checked={savePaymentInfo}
                              onCheckedChange={checked =>
                                setSavePaymentInfo(!!checked)
                              }
                            />
                            <Label htmlFor="save-payment" className="text-sm">
                              Save payment information for future use
                            </Label>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center pt-2 text-sm text-app-gray">
                        <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                        <span>
                          Your payment information is encrypted and secure
                        </span>
                      </div>
                    </div>

                    <CardFooter className="flex justify-end pt-6 px-0">
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-app hover:bg-app/90"
                        disabled={isSubmitting}>
                        {isSubmitting
                          ? 'Processing...'
                          : `Pay $${adData.price}`}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
