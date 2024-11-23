document.getElementById('convertBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
      alert('Please select a file first!');
      return;
  }

  const fileType = file.name.split('.').pop().toLowerCase();

  try {
      switch (fileType) {
          case 'txt':
              const textContent = await file.text();
              convertTextToPDF(textContent);
              break;
          case 'csv':
          case 'xlsx':
              const spreadsheetBuffer = await file.arrayBuffer();
              convertSpreadsheetToPDF(spreadsheetBuffer);
              break;
          case 'docx':
              const docxBuffer = await file.arrayBuffer();
              convertDocxToPDF(docxBuffer);
              break;
          case 'jpg':
          case 'png':
              convertImageToPDF(file);
              break;
          case 'pdf':
              handlePDF(file);
              break;
          default:
              alert('Unsupported file type. Please upload a valid file.');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the file.');
  }
});

function convertTextToPDF(content) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const lines = pdf.splitTextToSize(content, 180);
  let cursorY = 10;

  lines.forEach(line => {
      if (cursorY + 10 > pdf.internal.pageSize.height) {
          pdf.addPage();
          cursorY = 10;
      }
      pdf.text(line, 10, cursorY);
      cursorY += 10;
  });

  showDownloadLink(pdf);
}

function convertSpreadsheetToPDF(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const csvContent = XLSX.utils.sheet_to_csv(sheet);

  convertTextToPDF(csvContent);
}

function convertDocxToPDF(arrayBuffer) {
  mammoth.extractRawText({ arrayBuffer })
      .then(result => convertTextToPDF(result.value))
      .catch(err => alert('Failed to process DOCX file: ' + err));
}

function convertImageToPDF(file) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const reader = new FileReader();

  reader.onload = function (e) {
      const imgData = e.target.result;
      pdf.addImage(imgData, 'JPEG', 10, 10, 180, 240);
      showDownloadLink(pdf);
  };

  reader.readAsDataURL(file);
}

function handlePDF(file) {
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.style.display = 'inline-block';
  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = file.name;
  downloadLink.textContent = 'Download PDF';
}

function showDownloadLink(pdf) {
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.style.display = 'inline-block';
  downloadLink.href = pdf.output('bloburl');
  downloadLink.download = 'converted.pdf';
  downloadLink.textContent = 'Download PDF';
}
