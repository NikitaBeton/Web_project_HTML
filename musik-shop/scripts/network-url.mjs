import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.VITE_PORT || 5173

function getLocalIpv4() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      const isIpv4 = net.family === 'IPv4' || net.family === 4
      if (isIpv4 && !net.internal) {
        return net.address
      }
    }
  }
  return null
}

const ip = getLocalIpv4()
if (!ip) {
  console.error('Не удалось определить IP в локальной сети. Проверьте Wi‑Fi/Ethernet.')
  process.exit(1)
}

const url = `http://${ip}:${PORT}`
const outPath = path.join(__dirname, '..', 'network-link.txt')

const content = `# Ссылка для доступа к Musik Shop с другого устройства (та же Wi‑Fi / LAN)
# Сгенерировано: ${new Date().toLocaleString('ru-RU')}

${url}

Условия:
1. На этом компьютере запущены: npm run dev:backend и npm run dev (frontend)
2. Другое устройство в той же сети
3. Фаервол разрешает вход на порты ${PORT} и 3000
`

fs.writeFileSync(outPath, content, 'utf8')
console.log('\n  Ссылка для другого устройства:\n')
console.log(`  ${url}\n`)
console.log(`  Сохранено в: ${outPath}\n`)
