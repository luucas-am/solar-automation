import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();

async function startUp() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is not defined.');
  }
  await page.goto(process.env.BASE_URL);

  await page.waitForSelector('div.user.hasDropList-focus', { timeout: 0 });

  if (!process.env.ACTION_URL) {
    throw new Error('ACTION_URL environment variable is not defined.');
  }
  await page.goto(process.env.ACTION_URL);

  await page.waitForSelector("span:text('Modo de Trabalho do Sistema-1')", { timeout: 0 });
  await page.locator('div').filter({ hasText: /^Modo de Trabalho do Sistema-1$/ }).locator('span').getByText('Modo de Trabalho do Sistema-1').click();

  console.log('Bot started successfully');
  return { page };
}

const { page } = await startUp();

cron.schedule("* 7 * * *", async () => {
  await page.fill("#form_item_00F4", "Exportação zero para CT").then(async () => {
    await page.keyboard.press('Enter');
  });

  await page.fill("#form_item_00F7", "Desativar").then(async () => {
    await page.keyboard.press('Enter');
  });

  await page.locator('button').filter({ hasText: /^Ler$/ }).locator('span').getByText('Ler').click();
  await page.waitForTimeout(10000);
  await page.locator('button').filter({ hasText: /^Configurar$/ }).locator('span').getByText('Configurar').click();
});

cron.schedule("* 18 * * *", async () => {
  await page.fill("#form_item_00F4", "Grid vendendo primeiro").then(async () => {
    await page.keyboard.press('Enter');
  });

  await page.locator('button').filter({ hasText: /^Ler$/ }).locator('span').getByText('Ler').click();
  await page.waitForTimeout(10000);
  await page.locator('button').filter({ hasText: /^Configurar$/ }).locator('span').getByText('Configurar').click();
});