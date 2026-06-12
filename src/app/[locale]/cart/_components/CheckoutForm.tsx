'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTotalAmount } from '@/lib/cart';
import { formatCurrency } from '@/lib/formatters';
import { selectCartItems } from '@/redux/features/cart/cartSlice';
import { useAppSelector } from '@/redux/hooks';
// import { Routes } from "@/constants/enums";
// import Link from '@/components/link';
import { useState } from "react";
function CheckoutForm() {
  const cart = useAppSelector(selectCartItems);
  const totalAmount = getTotalAmount(cart);
  const [phone, setPhone] = useState("");
const [streetAddress, setStreetAddress] = useState("");
const [postalCode, setPostalCode] = useState("");
const [city, setCity] = useState("");
const [country, setCountry] = useState("");
const isFormValid =
  phone.trim() &&
  streetAddress.trim() &&
  postalCode.trim() &&
  city.trim() &&
  country.trim();
  const shippingData = {
  phone,
  streetAddress,
  postalCode,
  city,
  country,
};
  return (
    cart &&
    cart.length > 0 && (
      <div className='grid gap-6 bg-gray-100 rounded-md p-4'>
        <h2 className='text-2xl text-black font-semibold'>Checkout</h2>
        <form>
          <div className='grid gap-4'>
            <div className='grid gap-1'>
              <Label htmlFor='phone' className='text-accent'>
                Phone
              </Label>
              {/* <Input
                id='phone'
                placeholder='Enter your phone'
                type='text'
                name='phone'
              /> */}
              <Input
  id="phone"
  type="text"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Enter your phone"
  required
/>
            </div>
            <div className='grid gap-1'>
              <Label htmlFor='address' className='text-accent'>
                Street address
              </Label>
              {/* <Textarea
                id='address'
                placeholder='Enter your address'
                name='address'
                className='resize-none'
              /> */}
              <Textarea
  id="address"
  value={streetAddress}
  onChange={(e) => setStreetAddress(e.target.value)}
  placeholder="Enter your address"
  className="resize-none"
  required
/>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className='grid gap-1'>
                <Label htmlFor='postal-code' className='text-accent'>
                  Postal code
                </Label>
                {/* <Input
                  type='text'
                  id='postal-code'
                  placeholder='Enter postal code'
                  name='postal-code'
                /> */}
                <Input
  type="text"
  id="postal-code"
  value={postalCode}
  onChange={(e) => setPostalCode(e.target.value)}
  placeholder="Enter postal code"
  required
/>
              </div>
              <div className='grid gap-1'>
                <Label htmlFor='city' className='text-accent'>
                  City
                </Label>
                <Input
                  type='text'
                  id='city'
                  placeholder='Enter your City'
                  name='city'
                value={city}
  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className='grid gap-1'>
                <Label htmlFor='country' className='text-accent'>
                  Country
                </Label>
                <Input
                  type='text'
                  id='country'
                  placeholder='Enter your country'
                  name='country'
                    value={country}
  onChange={(e) => setCountry(e.target.value)}

                />
              </div>

    
<Button
  type="button"
  className="h-10 w-full"
  disabled={!isFormValid}
  onClick={async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        shippingData,
      }),
    });

    const data = await response.json();

    console.log(data);
    localStorage.setItem(
  "shippingData",
  JSON.stringify(shippingData)
);

window.location.href = "/en/checkout";
  }}
>
  Checkout ({formatCurrency(totalAmount)})
</Button>
 </div>
     
          </div>
        </form>
      </div>
    )
  );
}

export default CheckoutForm;
