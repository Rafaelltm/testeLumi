import React from 'react';

const Base64ToPdfDownloader: React.FC<{ base64String: string, fileName: string, isDisabled: boolean, btnClassName: string }> = ({ base64String, fileName, isDisabled, btnClassName }) => {
  const downloadPdf = () => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <button className={btnClassName} disabled={!isDisabled} onClick={downloadPdf}>Download Fatura</button>
  );
};

export default Base64ToPdfDownloader;
