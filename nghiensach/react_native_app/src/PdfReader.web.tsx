import { useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export function PdfReader({ uri }: { uri: string }) {
  const [pages, setPages] = useState(0);
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width - 24, 900);

  return <ScrollView
    style={{ flex: 1, backgroundColor: '#dfe4e0' }}
    contentContainerStyle={{ alignItems: 'center', padding: 12, gap: 12 }}
  >
    <Document
      file={uri}
      loading={<Message text="Đang tải PDF…" />}
      error={<Message text="Không thể hiển thị PDF. Hãy thử mở lại chương." />}
      onLoadSuccess={({ numPages }) => setPages(numPages)}
    >
      {Array.from({ length: pages }, (_, index) => <View key={index}>
        <Page
          pageNumber={index + 1}
          width={pageWidth}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </View>)}
    </Document>
  </ScrollView>;
}

function Message({ text }: { text: string }) {
  return <View style={{ padding: 24 }}><Text style={{ color: '#526057' }}>{text}</Text></View>;
}
