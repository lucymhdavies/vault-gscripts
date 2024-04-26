function setInitialProperties(reset) {
  var userProperties = PropertiesService.getUserProperties();
  if (reset == true) {
    userProperties.deleteAllProperties();
  }

  promptForProperty("VAULT_ADDR", "Vault Address");
  promptForProperty("VAULT_NAMESPACE", "Vault Namespace");
  promptForProperty("ROLE_ID", "AppRole Role ID");
  promptForProperty("SECRET_ID", "AppRole Secret ID");
}

function promptForProperty(key, description) {
  var ui = SpreadsheetApp.getUi();
  response = ui.prompt("Enter " + description)

  if ( response.getSelectedButton() == "CLOSE" ) {
    console.error("User pressed close button")
    throw "User pressed close button"
  }
  value = response.getResponseText();
  
  if (value == "" || value == undefined || value == null) {
    console.error("No value!")
    throw "No value!"
  }

  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(key, value);
}

// TODO: generic vault request, authed or unauthed
function vaultRequest(method, path, data=null, token="") {
  // TODO: check we have our required properties set
  var userProperties = PropertiesService.getUserProperties();
  vault_addr      = userProperties.getProperty("VAULT_ADDR")
  vault_namespace = userProperties.getProperty("VAULT_NAMESPACE")


  var headers = {
      "X-Vault-Namespace" : vault_namespace,
  }
  if (token != "") {
    headers["X-Vault-Token"] = token
  }
  var options = {
    'headers': headers,
    'method' : method,
    'contentType': 'application/json'
  }
  if (data != null) {
    options["payload"] = JSON.stringify(data)
  }

  var url = vault_addr + "/v1/" + path

  //console.log("Req: " + url + JSON.stringify(options))

  var response = UrlFetchApp.fetch(url, options );
  var json = response.getContentText();

  return JSON.parse(json)
}

function auth() {
  // TODO: check we have our required properties set
  var userProperties = PropertiesService.getUserProperties();
  role_id         = userProperties.getProperty("ROLE_ID")
  secret_id       = userProperties.getProperty("SECRET_ID")

  auth = vaultRequest("post", "auth/approle/login", {'role_id': role_id,'secret_id': secret_id})

  // TODO: validate the response before doing this
  return auth.auth.client_token;
}

function tokenLookup() {
  token = auth()
  lookup = vaultRequest("get", "auth/token/lookup-self", null, token)
  return lookup.data
}

function kvGet(path) {
  token = auth()
  data = vaultRequest("get", path, null, token)
  return data.data.data
}
