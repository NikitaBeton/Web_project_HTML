import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import localtunnel from 'localtunnel'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.VITE_PORT) || 5173
const SUBDOMAIN = process.env.TUNNEL_SUBDOMAIN || 'musik-shop-mweb4ik'
const OUT_FILE = path.join(__dirname, '..', 'public-link.txt')

async function openTunnel(options) {
  return localtunnel({ port: PORT, ...options })
}

async function main() {
  console.log('\n  Запуск публичного туннеля Musik Shop…')
  console.log(`  Локальный порт: ${PORT}`)
  console.log('  Убедитесь, что запущены: npm run dev:backend и npm run dev\n')

  let tunnel
  try {
    tunnel = await openTunnel({ subdomain: SUBDOMAIN })
  } catch {
    console.warn(`  Поддомен «${SUBDOMAIN}» занят, создаём случайный адрес…`)
    tunnel = await openTunnel({})
  }

  const url = tunnel.url
  const title = 'Musik Shop — магазин музыкального оборудования'

  const content = `# ${title}
# Публичная ссылка (работает из любой сети, пока туннель запущен)
# Обновлено: ${new Date().toLocaleString('ru-RU')}

Название: ${title}
Ссылка:   ${url}/
API:      ${url}/api/health

Как открыть с телефона или другого города:
1. На этом компьютере должны работать backend и frontend (npm run dev:backend, npm run dev)
2. Этот скрипт должен оставаться запущенным: npm run share
3. Откройте ссылку выше в браузере

Примечание: при первом входе localtunnel может показать страницу-предупреждение —
нажмите «Click to continue» / «Продолжить».
`

  fs.writeFileSync(OUT_FILE, content, 'utf8')

  console.log('  ─────────────────────────────────────────')
  console.log(`  ${title}`)
  console.log(`  Сайт:  ${url}/`)
  console.log(`  API:   ${url}/api/health`)
  console.log('  ─────────────────────────────────────────')
  console.log(`  Сохранено: ${OUT_FILE}`)
  console.log('\n  Туннель активен. Остановка: Ctrl+C\n')

  tunnel.on('error', (err) => {
    console.error('Ошибка туннеля:', err.message)
  })

  const shutdown = () => {
    tunnel.close()
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
