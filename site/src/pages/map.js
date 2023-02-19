import MapPageContents from "@/components/MapPageContents";
import { DataProvider } from "@/contexts/DataContext";

export default function MapPage({ detections }) {
  return <DataProvider detections={detections}><MapPageContents /></DataProvider>;
}

export const getStaticProps = async () => {
  const detections = require('../../assets/detections.json')
  return {
    props: {
      detections
    },
  }
}