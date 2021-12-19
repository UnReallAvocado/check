const {default: axios} = require("axios");
const fs = require("fs");
const playwright = require("playwright");
const webhook = require("webhook-discord");
const Hook = new webhook.Webhook("https://discord.com/api/webhooks/921685609817448458/yHSbhojNoYKHGCNTuZjAa5yYvYqYo8O1Aat0eNGSIOVzcgFpW1hHa1t2JI5moDN2CK_p");

(async  function() {
    while (true) {
        await sleep(await GenerateToken("Proxyless"));
    }
})();

function GenerateToken(Proxy) {
    return new Promise(async function(resolve) {
      
        console.log("[+] Starting...");
        var fs = require('fs');
        var array = fs.readFileSync('proxies.txt').toString().split("\n");
        var proxies = array[Math.floor(Math.random() * array.length)];
        
        
        const PBrowser = await playwright.firefox.launch(
            {
            headless: true,
            
           });
           console.log('[+] Proxy: ' + proxies)
        const PContext = await PBrowser.newContext();
        const PPage = await PContext.newPage();
        var startTime = Date.now();
       
            try {
                try{
                await PPage.goto("https://discord.com/", {"timeout": 60000, "waitUntil": "networkidle"});
                }catch{
                    console.log('[+] Removed bad proxies: ' + proxies)

                    fs.readFile('proxies.txt', 'utf8', function (err,data) {

                        var formatted = data.replace(proxies, ' ');
                      
                       fs.writeFile('proxies.txt', formatted, 'utf8', function (err) {
                          if (err) return console.log(err);
                       });
                      });
                    await PBrowser.close()
                    GenerateToken()
                } 
                await PPage.click("#app-mount > div > div > div.grid-3Ykf_K.heroBackground-3m0TRU > div.row-3wW-Fx.heroContainer-3j1eQg > div > div.ctaContainer-3vWJHU > button");
                await sleep(1000);
                try{
                await PPage.type("input.username-27KRPU", Math.random().toString(36).substring(2, 7) + " | AvoGen"+ "\n", {"timeout": 5000});
                }catch{
                    console.log('[+] Ratelimited')
                    await PBrowser.close();
                    GenerateToken()
                }
                await PPage.waitForSelector("iframe");
                console.log("[+] CAPTCHA DETECTED!");
                startTime = Date.now();
                await sleep(3000);
                await PPage.click("iframe");
               
                var email = Math.random().toString(36).substring(2, 12);
                await axios.post("https://api.internal.temp-mail.io/api/v3/email/new", {"domain": "kjkszpjcompany.com", "name": email});
                email += "@kjkszpjcompany.com";
                await sleep(1000);
                try{
                    await PPage.waitForSelector("#react-select-2-input");
                }catch{
                    console.log('[+] Failed to bypass captcha')
                    await PBrowser.close();
                    GenerateToken();
                }
              
                await PPage.type("#react-select-2-input", "January\n");
                await PPage.type("#react-select-3-input", "1\n");
                await PPage.type("#react-select-4-input", "2000\n\n");
                await PPage.waitForSelector("button.close-hZ94c6");
                await PPage.click("button.close-hZ94c6");
                await sleep(1000);
                await PPage.waitForSelector("input[type='text']");
                await PPage.type("input[type='text']", email);
                await PPage.type("input[type='password']", "AvoGenOp\n");
    
                var emailData;
                while (true) {
                    var emailData = await axios.get("https://api.internal.temp-mail.io/api/v3/email/" + email + "/messages").then(res => res.data);
                    if (emailData.length !== 0) {
                        emailData = emailData[0].body_text.split("Verify Email: ")[1].trim();
                        break;
                    }
                    await sleep(1000);
                }
                await PPage.goto(emailData);
                await PPage.waitForSelector("h3.title-jXR8lp");
                while (await PPage.innerText("h3.title-jXR8lp") !== "Email Verified!") {
                    try {
                        await PPage.waitForSelector("iframe", {"timeout": 5000});
                        await PPage.click("iframe");
                    }
                    catch {}
                    await sleep(1000);
                }
                console.log("[+] ACCOUNT VERIFIED!");
                var Token = await PPage.evaluate(function() {
                    var iframe = document.createElement("iframe");
                    document.head.append(iframe);
                    return iframe.contentWindow.localStorage.getItem("token").replace(/"/g, "");
                });
                fs.appendFileSync("./Tokens.txt", Token + "\n");
            fs.appendFileSync("./combo.txt", email + ":AvoGenOp123" +  "\n");
                console.log("[+] TOKENS SENT TO WEBHOOK: " + Buffer.from(Token.split(".")[0], "base64").toString() + " | ");
                await PBrowser.close();
                const msg = new webhook.MessageBuilder()
                    .setName("AvoGen")
                    .setText(Token);
                    Hook.send(msg);
                console.log("[+] Starting...!");  
            }
            catch(e) {
                console.log('Catch an error: ', e)
              }
        resolve(startTime + 150000 - Date.now());
    });
}
function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}