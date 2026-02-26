"use client";

import Script from "next/script";

export default function KakaoScript() {
    return (
        <Script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js"
            integrity="sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJ5/568/HhzT1R2S1Yoh4oE7V"
            crossOrigin="anonymous"
            strategy="lazyOnload"
            onLoad={() => {
                if (window.Kakao && !window.Kakao.isInitialized()) {
                    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY || 'YOUR_KAKAO_APP_KEY');
                }
            }}
        />
    );
}
