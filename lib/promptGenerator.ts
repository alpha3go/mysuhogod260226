// lib/promptGenerator.ts
import { FortuneResult } from "./fortuneEngine";

export function generateImagePrompt(fortune: FortuneResult, name: string, theme: string = "friend"): string {
  // DALL-E 3 고해상도 이미지 프롬프트 생성
  // 요건: 귀엽고 따뜻한 꼬마 수호천사, 3D 렌더링 스타일, 밝은 분위기
  // 속성 반영: 오행(element), 수비학 번호(lifePathNumber), 별자리(zodiacSign) 테마

  let elementTheme = "";
  if (fortune.element.includes("수")) elementTheme = "water droplet details, gentle blue and teal colors, flowing textures";
  else if (fortune.element.includes("화")) elementTheme = "warm fire sparks, gentle red and orange glow, bright lighting";
  else if (fortune.element.includes("목")) elementTheme = "leaf patterns, green and earthy tones, nature vibes";
  else if (fortune.element.includes("금")) elementTheme = "shiny metallic accents, gold and silver elegant tones, glowing light";
  let styleDescription = "";
  if (theme === "animal") {
    styleDescription = `Cute and adorable personalized illustration of a character inspired by the ${fortune.zodiacAnimal} zodiac animal, dressed in small angelic wings`;
  } else if (theme === "general") {
    styleDescription = `Strong and reliable guardian deity character inspired by a traditional general (Jang-gun), wearing ornate but cute traditional armor, holding a protective shield or sword, yet with a charming and friendly vibe`;
  } else {
    // "friend" or default
    styleDescription = `Friendly and cute little guardian angel character, looking like a trustworthy companion and friend, with a soft and lovable appearance`;
  }

  return `${styleDescription} for a person named "${name}", 2D flat illustration, sticker art style, soft pastel colors, simple clean lines, very adorable chibi proportions. Theme: ${fortune.zodiacSign} constellation symbols subtly integrated into the background. Visual elements: ${elementTheme}. High quality, 4k digital art, sticker quality, lovable and peaceful atmosphere, suitable for merchandise and wallpapers.`;
}

export function generateTextPrompt(fortune: FortuneResult, region: string, name: string, language: string = "ko"): string {
  if (language === "en") {
    return `You are a warm guardian angel who analyzes the fortune of "${name}".
User Analysis Results:
- Zodiac Sign: ${fortune.zodiacSign}
- Core Energy (Five Elements): ${fortune.element}
- Numerology (Life Path Number): ${fortune.lifePathNumber}
- Place of Birth: ${region}

Please respond in the following JSON format:
{
  "angelName": "A beautiful English name that fits the guardian angel's light/attribute",
  "comfortMessage": "A message of support/comfort (3-4 sentences, friendly tone)",
  "fortuneMessage": "Based on the results, upcoming luck and precautions (3 sentences)",
  "luckyNumbers": [6 numbers],
  "luckyFood": "Food for luck",
  "luckyOutfit": "Coordinated outfit for luck",
  "luckyPlace": "Place for good energy",
  "analysisSummary": "A concise expert-level summary (3-4 sentences) explaining how Saju, Numerology, and Astrology overlap for this user."
}
Output only JSON.`;
  }

  // GPT 텍스트 생성을 위한 한국어 프롬프트 (기본값)
  return `당신은 "${name}"님의 운세를 분석해주는 따뜻한 수호천사입니다.
사용자 분석 결과:
- 별자리: ${fortune.zodiacSign}
- 핵심 기운(오행): ${fortune.element}
- 수비학 번호: ${fortune.lifePathNumber}
- 태어난 장소: ${region}

다음 JSON 형태로 응답해 주세요:
{
  "angelName": "수호천사의 이름",
  "comfortMessage": "따뜻한 위로의 메시지 (3~4문장)",
  "fortuneMessage": "행운과 주의사항 (3문장 이내)",
  "luckyNumbers": [6개의 행운의 숫자],
  "luckyFood": "행운의 음식",
  "luckyOutfit": "행운의 코디",
  "luckyPlace": "행운의 장소",
  "analysisSummary": "사주, 수비학, 점성술 분석 정보를 종합하여 사용자에게 설명해주는 전문적인 요약 (3~4문장)"
}
오직 JSON만 출력해야 합니다.`;
}
