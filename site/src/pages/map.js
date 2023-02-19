import MapPageContents from "@/components/MapPageContents";
import { DataProvider } from "@/contexts/DataContext";

export default function MapPage({ hotspots }) {
  return <DataProvider hotspots={hotspots}><MapPageContents /></DataProvider>;
}

export const getStaticProps = async () => {
  const hotspots = require('../../assets/hotspots.json')
  return {
    props: {
      hotspots
    },
  }
}