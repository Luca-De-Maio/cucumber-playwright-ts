import { Given, When, Then, Before } from '@cucumber/cucumber'
import { fixture } from "../hooks/pageFixture"
import { LoginPage } from '../pages/LoginPage'
import  Assert  from '../../helper/wrapper/assert'
import { PageFactory } from '../../helper/factories/PageFactory';



let assert: Assert;
let loginPage: LoginPage;


Given('I visit a login page', async function () {
  loginPage = global.pageFactory.createLoginPage();
  await loginPage.navigateToLoginScreen();
});

When('I fill the login form with valid credentials', async function () {
  await loginPage.login();
});

Then('I should see the home page', async function () {
  assert = new Assert(fixture.page);
  //await loginPage.assertUserIsLoggedIn();

  await assert.assertTitleContains('Zero - Transfer Funds');
});