import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../../helper/browsers/browserManager";
import { getEnv } from "../../helper/env/env";
import { createLogger } from "winston";
import { options } from "../../helper/util/logger";
import { PageFactory } from "../../helper/factories/PageFactory";
const fs = require("fs-extra");

let browser: Browser;
let context: BrowserContext;

declare global {
    namespace NodeJS {
      interface Global {
        pageFactory: PageFactory;
      }
    }
}

BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
    
});

// It will trigger for not auth scenarios
Before({ tags: "not @auth" }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext({
        recordVideo: {
            dir: "test-results/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
    // Initialize PageFactory
    global.pageFactory = new PageFactory(fixture.page);
});


// It will trigger for auth scenarios
Before({ tags: '@auth' }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext({
        storageState: getStorageState(pickle.name),
        recordVideo: {
            dir: "test-results/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
    // Initialize PageFactory
    global.pageFactory = new PageFactory(fixture.page);
});

After(async function ({ pickle, result }) {
    let videoPath: string | null;
    let img: Buffer;
    const path = `./test-results/trace/${pickle.id}.zip`;
    if (result?.status == Status.PASSED) {
        let img: Buffer | undefined;
        img = await fixture.page.screenshot(
            { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" });
        const video = fixture.page.video();
        if (video) {
            videoPath = await video.path();
        } else {
            videoPath = null;
        }
    } else {
        videoPath = null;
    }
    await context.tracing.stop({ path: path });
    await fixture.page.close();
    await context.close();
});

AfterAll(async function () {
    await browser.close();
});

function getStorageState(user: string): string | { cookies: { name: string; value: string; domain: string; path: string; expires: number; httpOnly: boolean; secure: boolean; sameSite: "Strict" | "Lax" | "None"; }[]; origins: { origin: string; localStorage: { name: string; value: string; }[]; }[]; } | undefined {
    if (user.endsWith("admin"))
        return "src/helper/auth/admin.json";
    else if (user.endsWith("lead"))
        return "src/helper/auth/lead.json";
    else
        return undefined;
}

