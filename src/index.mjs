import path from "path";
import puppeteer from "puppeteer";
import mjml from "mjml";
import mustache from "mustache";

import { readFile } from "./utils";
import { DIST_PATH, PUBLIC_PATH } from "./constants";

const preProcess = html => {
  // @section: mustache template processing:
  const populatedHtml = mustache.render(html, {
    name: "Test mustache variable"
  });

  return mjml(populatedHtml).html;
};

(async () => {
  const name = "index";
  const source = path.resolve(PUBLIC_PATH, `${name}.html`);
  const target = path.resolve(DIST_PATH, `${name}.pdf`);

  try {
    const html = preProcess(await readFile(source, { encoding: "utf8" }));
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // @note: https://github.com/GoogleChrome/puppeteer/issues/728 :
    // await page.setContent(html);
    await page.goto(`data:text/html,${html}`, { waitUntil: "networkidle0" });
    // @note: generate with pdf a png
    await page.screenshot({
      path: path.resolve(DIST_PATH, `${name}.png`),
      fullPage: true,
      type: "png"
    });
    // @see: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    await page.pdf({
      path: target,
      format: "A4"
    });
    await browser.close();
  } catch (error) {
    console.error("Error", error);
  }
})();
