"use client";

import { useState } from "react";
import InputForm from "../components/InputForm";
import Loading from "../components/Loading";
import ResultCard from "../components/ResultCard";
import AdBanner from "../components/AdBanner";

export default function Home() {
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
      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingBottom: '100px' }}>
        <header style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '-2px' }}>
            My Suhogod
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
            사주, 수비학, 어스트롤로지로 분석하는<br />나만의 귀여운 맞춤 수호천사
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
