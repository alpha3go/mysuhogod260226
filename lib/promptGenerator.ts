// lib/promptGenerator.ts
import { FortuneResult } from "./fortuneEngine";

export function generateImagePrompt(fortune: FortuneResult): string {
  // DALL-E 3 고해상도 이미지 프롬프트 생성
  // 요건: 귀엽고 따뜻한 꼬마 수호천사, 3D 렌더링 스타일, 밝은 분위기
  // 속성 반영: 오행(element), 수비학 번호(lifePathNumber), 별자리(zodiacSign) 테마

  let elementTheme = "";
  if (fortune.element.includes("수")) elementTheme = "water droplet details, gentle blue and teal colors, flowing textures";
  else if (fortune.element.includes("화")) elementTheme = "warm fire sparks, gentle red and orange glow, bright lighting";
  else if (fortune.element.includes("목")) elementTheme = "leaf patterns, green and earthy tones, nature vibes";
  else if (fortune.element.includes("금")) elementTheme = "shiny metallic accents, gold and silver elegant tones, glowing light";
  else elementTheme = "grounding earthy tones, crystal and rock elements, warm yellow and brown";

  return `Cute and warm 3D rendered little guardian angel character, neo-brutalism inspired but highly adorable and soft, chibi style, holding a magic wand, floating in a bright background. Theme: ${fortune.zodiacSign} constellation symbols delicately placed in the background. Visual elements: ${elementTheme}. Core numeric aura glowing with the number ${fortune.lifePathNumber}. High quality, 4k resolution, colorful, comforting, and peaceful atmosphere.`;
}

export function generateTextPrompt(fortune: FortuneResult, region: string, language: string = "ko"): string {
  if (language === "en") {
    return `You are a warm guardian angel who analyzes the user's fortune.
User Analysis Results:
- Zodiac Sign: ${fortune.zodiacSign}
- Core Energy (Five Elements): ${fortune.element}
- Numerology (Life Path Number): ${fortune.lifePathNumber}
- Place of Birth: ${region}

Please respond in the following JSON format:
{
  "angelName": "A beautiful English name that fits the guardian angel's light/attribute (e.g., Shasha the Dewdrop Angel)",
  "comfortMessage": "A message of support/comfort that makes the user feel warmly hugged and protected (3-4 sentences, friendly tone)",
  "fortuneMessage": "Reflecting the analysis results slightly, upcoming opportunities or luck, and brief precautions (gentle tone, within 3 sentences)"
}
Output only JSON.`;
  }

  // GPT 텍스트 생성을 위한 한국어 프롬프트 (기본값)
  return `당신은 사용자의 운세를 분석해주는 따뜻한 수호천사입니다.
사용자 분석 결과:
- 별자리: ${fortune.zodiacSign}
- 핵심 기운(오행): ${fortune.element}
- 수비학 번호: ${fortune.lifePathNumber}
- 태어난 장소: ${region}

다음 JSON 형태로 응답해 주세요:
{
  "angelName": "수호천사의 빛/속성에 어울리는 예쁜 한국어 이름 (예: 물방울 천사 샤샤)",
  "comfortMessage": "이용자를 따뜻하게 안아주고 곁에서 지켜준다는 느낌의 응원/위로 메시지 (3~4문장, 다정한 어투)",
  "fortuneMessage": "위 분석 결과를 약간 반영하여, 다가올 기회나 행운, 그리고 짧은 주의사항 (부드러운 어조, 3문장 이내)"
}
오직 JSON만 출력해야 합니다.`;
}
