'use client';
import Script from 'next/script';
import { useEffect } from 'react';

export function AdsBootstrap(){
  const caPub = process.env.NEXT_PUBLIC_ADSENSE_CA_PUB;
  if (!caPub) return null;
  return (
    <Script
      id="adsbygoogle-init"
      async
      crossOrigin="anonymous"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${caPub}`}
    />
  );
}

export function AdSlot(){
  useEffect(()=>{
    try{ (window as any).adsbygoogle = (window as any).adsbygoogle || []; (window as any).adsbygoogle.push({}); }catch{}
  }, []);
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  if (!slot) return null;
  return (
    <ins className="adsbygoogle block"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CA_PUB}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

