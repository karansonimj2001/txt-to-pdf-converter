document.getElementById('convertBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('txtFile');
    if (fileInput.files.length === 0) {
      alert('Please select a .txt file first!');
      return;
    }
  
    const file = fileInput.files[0];
    if (file.type !== 'text/plain') {
      alert('Invalid file type. Please upload a .txt file.');
      return;
    }
  
    // Read the file content
    const textContent = await file.text();
  
    // Convert to PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
  
    const lines = pdf.splitTextToSize(textContent, 180); // Adjust width
    let cursorY = 10;
  
    lines.forEach(line => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = 10;
      }
      pdf.text(line, 10, cursorY);
      cursorY += 10;
    });
  
    // Generate download link
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.style.display = 'inline-block';
    downloadLink.href = pdf.output('bloburl');
    downloadLink.download = 'converted.pdf';
    downloadLink.textContent = 'Download PDF';
  });
  