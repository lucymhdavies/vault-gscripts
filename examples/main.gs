function vaultInit() {
  Vault.setInitialProperties()
}

function showLinkToVault() {
  vaultUIURL = "https://vault.lmhd.me/ui/vault/secrets/kv/kv/monzo%2Fapi_token/details"

  var htmlOutput = HtmlService
      .createHtmlOutput('<a href='+vaultUIURL+' target=_blank>Click Here to set the Monzo Token in Vault</a>')
      .setWidth(300)
      .setHeight(100);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Vault');
}

function tokenLookup() {
  secret = Vault.tokenLookup()

  html = "<p>Token:</p>" + 
  '<pre>' + JSON.stringify(secret, null, 2) + '</pre>'

  var htmlOutput = HtmlService
      .createHtmlOutput(html)
      .setWidth(1000)
      .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Vault');
}

function showSecret() {
  secret = Vault.kvGet("kv/data/monzo/api_token")

  html = "<p>Secret:</p>" + 
  '<pre>' + JSON.stringify(secret, null, 2) + '</pre>'

  var htmlOutput = HtmlService
      .createHtmlOutput(html)
      .setWidth(1000)
      .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Vault');
}
