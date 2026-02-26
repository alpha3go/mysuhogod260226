"use client";

import { useState } from "react";
import InputForm from "../components/InputForm";
import Loading from "../components/Loading";
import ResultCard from "../components/ResultCard";
import AdBanner from "../components/AdBanner";
import { useLanguage } from "../components/LanguageContext";

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [resultData, setResultData] = useState({
    angelName: "",
    imageUrl: "",
    comfortMessage: "",
    fortuneMessage: ""
  });

  const handleSuccess = (data: any) => {
    setResultData({
      angelName: data.angelName,
      imageUrl: data.imageUrl,
      comfortMessage: data.comfortMessage,
      fortuneMessage: data.fortuneMessage
    });
    setStep("result");
  };

  const handleLoading = (isLoading: boolean) => {
    setStep(isLoading ? "loading" : "input");
  };

  return (
    <>
      <AdBanner position="left" />
      <AdBanner position="right" />
      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingBottom: '100px', position: 'relative' }}>

        {/* Language Toggle */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setLanguage("ko")}
            style={{ padding: '6px 12px', border: '2px solid #111', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', background: language === 'ko' ? '#111' : '#fff', color: language === 'ko' ? '#fff' : '#111' }}
          >
            KR
          </button>
          <button
            onClick={() => setLanguage("en")}
            style={{ padding: '6px 12px', border: '2px solid #111', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', background: language === 'en' ? '#111' : '#fff', color: language === 'en' ? '#fff' : '#111' }}
          >
            EN
          </button>
        </div>

        <header style={{ marginBottom: '60px', marginTop: '40px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '-2px' }}>
            {t("appTitle")}
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
            {t("appDesc1")}<br />{t("appDesc2")}
          </p>
        </header>

        {step === "input" && (
          <InputForm onSuccess={handleSuccess} setLoading={handleLoading} />
        )}

        {step === "loading" && <Loading />}

        {step === "result" && (
          <ResultCard
            angelName={resultData.angelName}
            imageUrl={resultData.imageUrl}
            comfortMessage={resultData.comfortMessage}
            fortuneMessage={resultData.fortuneMessage}
          />
        )}
      </main>
      <AdBanner position="bottom" />
    </>
  );
}
