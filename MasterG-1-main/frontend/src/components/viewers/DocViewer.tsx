import DOMPurify from 'dompurify';
...
const containerRef = useRef<HTMLDivElement>(null);
...
effect(() => {
  if (ext === 'docx') {
    renderDocx();
  } else if (ext === 'pptx' || ext === 'ppt') {
    tryPdfPreview();
  } else if (ext === 'doc') {
    setIsLoading(false);
    setError('Legacy .doc format requires Microsoft Word. Please download the file.');
  } else {
    setIsLoading(false);
  }
}, [url, ext]);
...
const renderDocx = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch document');
    const blob = await response.blob();
    try {
      const docxPreview = await import('docx-preview');
      if (containerRef.current) {
        const sanitizedHtml = DOMPurify.sanitize(blob);
        containerRef.current.innerHTML = sanitizedHtml;
        await docxPreview.renderAsync(sanitizedHtml, containerRef.current, undefined, {
          className: 'docx-preview',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          debug: false,
        });
      }
      setIsLoading(false);
    } catch (importError: any) {
      console.error('docx-preview not available:', importError);
      await fetchTextContent();
    }
  } catch (err: any) {
    console.error('DOCX render error:', err);
    setError(err.message || 'Failed to render document');
    setIsLoading(false);
  }
};