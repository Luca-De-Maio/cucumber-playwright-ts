import { expect, Locator, Page } from '@playwright/test'
import { AbstractPage } from './AbstractPage'

export class LoginPage extends AbstractPage {
  // Define selectors
  // readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  // Init selectors using constructor
  constructor(page: Page) {
    // this.page = page
    super(page)
    this.usernameInput = page.locator('#user_login')
    this.passwordInput = page.locator('#user_password')
    this.submitButton = page.locator('text=Sign in')
    this.errorMessage = page.locator('.alert-error')
  }

  // Define login page methods
  async login() {
    await this.usernameInput.fill('username')
    await this.passwordInput.fill('password')
    await this.submitButton.click()
    await this.page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html')
  }

  async assertErrorMessage() {
    await expect(this.errorMessage).toContainText(
      'Login and/or password are wrong'
    )
  }

  async navigateToLoginScreen() {
    await this.page.goto('http://zero.webappsecurity.com/login.html')
  }

  async submitLoginWithParameters(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async assertUserIsLoggedIn() {
    await this.page.waitForSelector('.inventory_lis')
  }

  async pause() {
    await this.page.waitForTimeout(3000)
  }
}
