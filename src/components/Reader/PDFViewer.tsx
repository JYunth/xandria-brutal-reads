import React, { useState } from 'react'
import { ReactReader } from 'react-reader'

interface PDFViewerProps {
  epubUrl: string;
}

const PDFViewer = ({ epubUrl }: PDFViewerProps) => {
  const [location, setLocation] = useState<string | number>(0)
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url={epubUrl}
        epubInitOptions={{
          openAs: 'epub',
        }}
        location={location}
        locationChanged={(epubcfi: string) => setLocation(epubcfi)}
      />
    </div>
  )
}

export default PDFViewer;
