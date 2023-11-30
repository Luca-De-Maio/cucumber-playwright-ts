import { Page } from "@playwright/test";
import { LoginPage } from "../../test/pages/LoginPage"; 

export class PageFactory {
    constructor(private page: Page) {}

    createLoginPage() {
        return new LoginPage(this.page);
    }

    // Add methods for other page objects...
}