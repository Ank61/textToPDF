chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "convertToPDF",
      title: "Convert page text to PDF",
      contexts: ["page"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "convertToPDF") {
        console.log("Getting convertToPDF")
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getPageText
      }, (results) => {
        if (results && results[0] && results[0].result) {
          const text = results[0].result;
          fetch('http://localhost:5000/api/generate-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
          })
          .then(response =>{
             return response.blob()})
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'output.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
          })
          .catch(error => console.error('Error:', error));
        }
      });
    }
  });
  
  function getPageText() {
    return document.body.innerText;
  }
  