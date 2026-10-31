// Ultra-reliable POS thermal receipt printing utility (prevents popup blockers and window freezing)
export const printReceiptTicket = (elementId = 'receipt-print', title = 'Mamata Tiffin Center Receipt') => {
  const printContent = document.getElementById(elementId);
  if (!printContent) {
    console.warn('Print target element not found:', elementId);
    return;
  }

  try {
    // Remove any previously created print iframe
    const oldFrame = document.getElementById('pos-print-iframe');
    if (oldFrame) {
      oldFrame.remove();
    }

    // Create an invisible iframe for reliable inline printing
    const iframe = document.createElement('iframe');
    iframe.id = 'pos-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow || iframe.contentDocument;
    const docRef = iframe.contentDocument || iframe.contentWindow.document;

    docRef.open();
    docRef.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
              font-size: 13px;
              color: #0f172a;
              background: #ffffff;
              margin: 0;
              padding: 10px;
              width: 76mm;
              box-sizing: border-box;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            #receipt-print {
              border: 2px dashed #0f172a !important;
              padding: 10px;
              border-radius: 12px;
              background: #ffffff;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    docRef.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        window.focus(); // Ensure parent window retains focus
      } catch (err) {
        console.error('Iframe print error, falling back:', err);
        window.print();
      }
    }, 250);
  } catch (error) {
    console.error('Failed to trigger receipt print:', error);
    try {
      window.print();
    } catch {}
  }
};
