// One-time data migration: populates translations.ru.{description,coverageHighlights}
// for the 12 existing insurance plan documents. Safe to re-run (idempotent
// upserts by plan `id`); does nothing to plans not listed below.
import "dotenv/config"
import mongoose from "mongoose"
import { InsurancePlan } from "../src/models/insurance-plan.model.js"

const TRANSLATIONS: Record<string, { description: string; coverageHighlights: string[] }> = {
  "health-basic-hmo": {
    description:
      "Доступный старт медицинского страхования с моделью управляемой помощи в сети партнёров.",
    coverageHighlights: [
      "Визиты к терапевту покрываются после соплатежа",
      "Направления к специалистам внутри сети",
      "Покрытие дженериков по рецепту",
    ],
  },
  "health-standard-ppo": {
    description:
      "Гибкий выбор врачей с умеренной франшизой — для повседневных медицинских потребностей.",
    coverageHighlights: [
      "Приём у любого врача без направления",
      "Профилактическая помощь покрывается на 100%",
      "Неотложная помощь и телемедицина включены",
      "Покрытие как оригинальных, так и дженериковых препаратов",
    ],
  },
  "health-premium-ppo": {
    description: "Наш самый популярный план: низкие собственные расходы и общенациональная сеть PPO.",
    coverageHighlights: [
      "Низкая франшиза и широкая общенациональная сеть",
      "Визиты к специалистам без направления",
      "Включено ведение беременности и уход за новорождённым",
      "Покрытие психиатрической помощи и лечения зависимостей",
    ],
  },
  "health-elite-pos": {
    description:
      "Страхование премиум-уровня для семей, которые хотят свести собственные расходы к минимуму.",
    coverageHighlights: [
      "Практически нулевая франшиза на серьёзные услуги",
      "Персональная координация лечения",
      "Экстренная помощь по всему миру во время путешествий",
      "Полное покрытие для лечения хронических заболеваний",
    ],
  },
  "dental-basic": {
    description: "Базовая профилактическая стоматологическая помощь по невысокой ежемесячной цене.",
    coverageHighlights: [
      "Две чистки и осмотра в год",
      "Ежегодный рентген включён",
      "Скидка на пломбирование",
    ],
  },
  "dental-premium": {
    description:
      "Комплексная стоматологическая страховка, включающая серьёзные вмешательства и ортодонтическое лечение.",
    coverageHighlights: [
      "Чистки, осмотры и фторирование включены",
      "Покрываются серьёзные процедуры: коронки и лечение каналов",
      "Ортодонтическое лечение для членов семьи покрывается",
    ],
  },
  "vision-basic": {
    description: "Простая и недорогая страховка для базового ежегодного ухода за зрением.",
    coverageHighlights: [
      "Ежегодный осмотр офтальмолога покрывается полностью",
      "Компенсация на оправы или контактные линзы",
      "Скидки на улучшенные линзы",
    ],
  },
  "vision-premium": {
    description:
      "Повышенная компенсация и дополнительные привилегии для тех, кто носит очки или линзы каждый день.",
    coverageHighlights: [
      "Повышенная компенсация на оправы и контактные линзы",
      "Покрытие премиальных покрытий для линз",
      "Скидка на LASIK у партнёров сети",
    ],
  },
  "life-standard-term": {
    description: "Простое срочное страхование жизни для защиты будущего вашей семьи.",
    coverageHighlights: [
      "Страховая выплата $250 000",
      "Срок действия 20 лет с фиксированным взносом",
      "Можно конвертировать в постоянное страхование",
    ],
  },
  "life-premium-whole": {
    description:
      "Пожизненное страхование, накапливающее денежную стоимость вместе со страховой выплатой.",
    coverageHighlights: [
      "Страховая выплата $250 000 без срока действия",
      "Накапливает денежную стоимость со временем",
      "Фиксированные взносы на всю жизнь",
    ],
  },
  "travel-standard": {
    description:
      "Страхование на случай медицинских экстренных ситуаций и нарушений поездки в любой точке мира.",
    coverageHighlights: [
      "Экстренная медицинская помощь за границей",
      "Отмена и прерывание поездки",
      "Возмещение за утерянный багаж",
      "Круглосуточная горячая линия поддержки в поездке",
    ],
  },
  "critical-illness-standard": {
    description:
      "Единовременная денежная выплата в случае диагностирования одного из покрываемых серьёзных заболеваний.",
    coverageHighlights: [
      "Единовременная выплата при диагностировании покрываемого заболевания",
      "Покрывает инфаркт, инсульт и онкологические заболевания",
      "Выплату можно использовать на любые цели, не только медицинские",
    ],
  },
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_DB_NAME })

  const operations = Object.entries(TRANSLATIONS).map(([id, translation]) => ({
    updateOne: {
      filter: { id },
      update: { $set: { "translations.ru": translation } },
    },
  }))

  const result = await InsurancePlan.bulkWrite(operations)
  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`)

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
